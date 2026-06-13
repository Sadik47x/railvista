import { supabase } from "@/lib/supabase/client";
import { mockBookings as initialBookings, Booking, BookingPassenger } from "@/data/bookings";

export const bookingService = {
  // Retrieve bookings from Supabase, or fall back to localStorage/mockBookings
  async getBookings(): Promise<Booking[]> {
    if (!supabase) {
      return this.getLocalBookings();
    }

    try {
      // 1. Fetch bookings with trains and coaches details
      const { data: dbBookings, error: bErr } = await supabase
        .from("bookings")
        .select(`
          id,
          pnr,
          booking_status,
          journey_date,
          total_fare,
          booking_date,
          train:train_id(
            train_number,
            train_name,
            departure_time,
            arrival_time,
            source_station:source_station_id(station_code, station_name),
            destination_station:destination_station_id(station_code, station_name)
          ),
          coach:coach_id(coach_name, coach_type)
        `)
        .order("created_at", { ascending: false });

      if (bErr || !dbBookings) {
        console.warn("Failed to retrieve database bookings, using local cache:", bErr?.message);
        return this.getLocalBookings();
      }

      const results: Booking[] = [];

      for (const b of dbBookings) {
        // 2. Fetch passengers for this booking
        const { data: dbPassengers, error: pErr } = await supabase
          .from("passengers")
          .select(`
            full_name,
            age,
            gender,
            berth_preference,
            seat:seat_id(seat_number)
          `)
          .eq("booking_id", b.id);

        if (pErr || !dbPassengers) continue;

        const passengersList: BookingPassenger[] = dbPassengers.map((p: any) => ({
          name: p.full_name,
          age: p.age,
          gender: p.gender,
          seatNumber: p.seat.seat_number.toString(),
          berthType: p.berth_preference,
        }));

        const seatsList = passengersList.map((p) => p.seatNumber);

        const trainInfo = b.train as any;
        const coachInfo = b.coach as any;

        let status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "PENDING" = "CONFIRMED";
        if (b.booking_status.toLowerCase() === "cancelled") status = "CANCELLED";
        if (b.booking_status.toLowerCase() === "completed") status = "COMPLETED";
        if (b.booking_status.toLowerCase() === "pending") status = "PENDING";

        results.push({
          id: b.id,
          pnr: b.pnr,
          trainNumber: trainInfo.train_number,
          trainName: trainInfo.train_name,
          fromStationCode: trainInfo.source_station.station_code,
          fromStationName: trainInfo.source_station.station_name,
          toStationCode: trainInfo.destination_station.station_code,
          toStationName: trainInfo.destination_station.station_name,
          departureTime: trainInfo.departure_time,
          arrivalTime: trainInfo.arrival_time,
          date: b.journey_date,
          classCode: coachInfo.coach_type,
          coachId: coachInfo.coach_name,
          seats: seatsList,
          passengers: passengersList,
          totalAmount: Number(b.total_fare),
          status,
          bookingDate: b.booking_date,
        });
      }

      return results;
    } catch (err) {
      console.warn("Exception in booking service, using fallback:", err);
      return this.getLocalBookings();
    }
  },

  async getBookingByPnr(pnr: string): Promise<Booking | null> {
    if (!supabase) {
      const locals = this.getLocalBookings();
      return locals.find((b) => b.pnr === pnr || b.id === pnr) || null;
    }

    try {
      const all = await this.getBookings();
      return all.find((b) => b.pnr === pnr || b.id === pnr) || null;
    } catch (err) {
      const locals = this.getLocalBookings();
      return locals.find((b) => b.pnr === pnr || b.id === pnr) || null;
    }
  },

  async getBookingByPNR(pnr: string): Promise<Booking | null> {
    return this.getBookingByPnr(pnr);
  },

  async getBookingById(id: string): Promise<Booking | null> {
    if (!supabase) {
      const locals = this.getLocalBookings();
      return locals.find((b) => b.id === id) || null;
    }

    try {
      const all = await this.getBookings();
      return all.find((b) => b.id === id) || null;
    } catch (err) {
      const locals = this.getLocalBookings();
      return locals.find((b) => b.id === id) || null;
    }
  },

  // Save/Create a booking
  async createBooking(booking: Booking): Promise<Booking | null> {
    if (!supabase) {
      this.saveLocalBooking(booking);
      return booking;
    }

    try {
      // 1. Resolve train_id
      const { data: train, error: trainErr } = await supabase
        .from("trains")
        .select("id")
        .eq("train_number", booking.trainNumber)
        .maybeSingle();

      if (trainErr || !train) {
        console.warn("Cannot find train ID to save booking");
        this.saveLocalBooking(booking);
        return null;
      }

      // 2. Resolve coach_id
      const { data: coach, error: coachErr } = await supabase
        .from("coaches")
        .select("id")
        .eq("train_id", train.id)
        .eq("coach_name", booking.coachId)
        .maybeSingle();

      if (coachErr || !coach) {
        console.warn("Cannot find coach ID to save booking");
        this.saveLocalBooking(booking);
        return null;
      }

      // 3. Prepare passenger JSON parameter for SQL RPC
      const passengersJson = booking.passengers.map((p) => ({
        full_name: p.name,
        age: p.age,
        gender: p.gender,
        berth_preference: p.berthType,
        seat_number: parseInt(p.seatNumber),
      }));

      // 4. Invoke atomic stored procedure RPC
      const { data: rpcResult, error: rpcErr } = await supabase.rpc(
        "create_booking_transaction",
        {
          p_train_id: train.id,
          p_coach_id: coach.id,
          p_journey_date: booking.date,
          p_total_fare: booking.totalAmount,
          p_booking_date: booking.bookingDate,
          p_passengers: passengersJson,
        }
      );

      if (rpcErr || !rpcResult || rpcResult.length === 0) {
        console.error("Failed to execute booking transaction RPC:", rpcErr?.message || "No result");
        return null;
      }

      // RPC returns [{ booking_id: "uuid", pnr: "xxx-xxxxxxx" }]
      const { booking_id, pnr } = rpcResult[0];

      const finalBooking: Booking = {
        ...booking,
        id: booking_id,
        pnr: pnr,
      };

      // Save to local storage as well for fast page cache/sync
      this.saveLocalBooking(finalBooking);
      return finalBooking;
    } catch (err) {
      console.warn("Exception in createBooking, saving locally:", err);
      this.saveLocalBooking(booking);
      return null;
    }
  },

  // Cancel a booking and release seat reservations
  async cancelBooking(bookingId: string): Promise<boolean> {
    // 1. Sync local storage cancellation first so offline mode works
    try {
      const locals = this.getLocalBookings();
      const idx = locals.findIndex((b) => b.id === bookingId || b.pnr === bookingId);
      if (idx !== -1) {
        locals[idx].status = "CANCELLED";
        if (typeof window !== "undefined") {
          localStorage.setItem("railvista_bookings", JSON.stringify(locals));
        }
      }
    } catch (err) {
      console.warn("Failed to update local bookings cancellation:", err);
    }

    if (!supabase) {
      return true;
    }

    try {
      const { error } = await supabase.rpc("cancel_booking_transaction", {
        p_booking_id: bookingId,
      });

      if (error) {
        console.error("Failed to cancel booking via RPC:", error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.warn("Exception in cancelBooking RPC:", err);
      return false;
    }
  },

  // Helper local storage accessors
  getLocalBookings(): Booking[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("railvista_bookings");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return initialBookings;
        }
      }
    }
    return initialBookings;
  },

  saveLocalBooking(booking: Booking) {
    if (typeof window !== "undefined") {
      const current = this.getLocalBookings();
      // Avoid duplicate PNR insertions
      if (!current.some((b) => b.pnr === booking.pnr)) {
        const updated = [booking, ...current];
        localStorage.setItem("railvista_bookings", JSON.stringify(updated));
      }
    }
  },
};
export default bookingService;
