import { supabase } from "@/lib/supabase/client";
import { generateSeatsForCoach as mockGenerateSeats, Seat } from "@/data/seats";

export const seatService = {
  async getSeatsForCoach(coachName: string, trainNumber: string, journeyDate?: string): Promise<Seat[]> {
    if (!supabase) {
      return mockGenerateSeats(coachName);
    }

    const startTime = performance.now();
    try {
      // 1. Resolve train ID from train number
      const { data: train, error: trainErr } = await supabase
        .from("trains")
        .select("id")
        .eq("train_number", trainNumber)
        .maybeSingle();

      if (trainErr || !train) {
        console.warn("Could not find train for seats, trying mock generator");
        return mockGenerateSeats(coachName);
      }

      // 2. Fetch coach using train_id and coach_name
      const { data: coach, error: coachErr } = await supabase
        .from("coaches")
        .select("id")
        .eq("train_id", train.id)
        .eq("coach_name", coachName)
        .maybeSingle();

      if (coachErr || !coach) {
        // Fallback: look up by coach_name only
        const { data: fallbackCoach, error: fErr } = await supabase
          .from("coaches")
          .select("id")
          .eq("coach_name", coachName)
          .limit(1);

        if (fErr || !fallbackCoach || fallbackCoach.length === 0) {
          console.warn("Could not find coach, using mock generator:", coachName);
          return mockGenerateSeats(coachName);
        }
        
        // Use fallback coach
        const coachId = fallbackCoach[0].id;
        const result = await this.querySeatsByCoachId(coachId, coachName, journeyDate);
        const duration = performance.now() - startTime;
        console.log(`[PERFORMANCE LOG] Seat Loading Duration: ${duration.toFixed(2)}ms`);
        return result;
      }

      const result = await this.querySeatsByCoachId(coach.id, coachName, journeyDate);
      const duration = performance.now() - startTime;
      console.log(`[PERFORMANCE LOG] Seat Loading Duration: ${duration.toFixed(2)}ms`);
      return result;
    } catch (err) {
      console.warn("Exception in seat service, using mock generator:", err);
      return mockGenerateSeats(coachName);
    }
  },

  async querySeatsByCoachId(coachId: string, coachName: string, journeyDate?: string): Promise<Seat[]> {
    if (!supabase) return mockGenerateSeats(coachName);

    const { data: dbSeats, error: seatErr } = await supabase
      .from("seats")
      .select("id, seat_number, berth_type, status, row_num, col_num")
      .eq("coach_id", coachId)
      .order("seat_number", { ascending: true });

    if (seatErr || !dbSeats || dbSeats.length === 0) {
      return mockGenerateSeats(coachName);
    }

    const reservedSeatIds = new Set<string>();
    if (journeyDate) {
      try {
        const seatIds = dbSeats.map((s) => s.id);
        const { data: reservations, error: resErr } = await supabase
          .from("seat_reservations")
          .select("seat_id")
          .in("seat_id", seatIds)
          .eq("journey_date", journeyDate)
          .eq("reservation_status", "confirmed");

        if (!resErr && reservations) {
          reservations.forEach((r) => {
            reservedSeatIds.add(r.seat_id);
          });
        }
      } catch (err) {
        console.warn("Error fetching seat reservations:", err);
      }
    }

    return dbSeats.map((s) => {
      let type: "Lower" | "Middle" | "Upper" | "Side Lower" | "Side Upper" = "Lower";
      let berthCode: "L" | "M" | "U" | "SL" | "SU" = "L";

      switch (s.berth_type) {
        case "LB": type = "Lower"; berthCode = "L"; break;
        case "MB": type = "Middle"; berthCode = "M"; break;
        case "UB": type = "Upper"; berthCode = "U"; break;
        case "SL": type = "Side Lower"; berthCode = "SL"; break;
        case "SU": type = "Side Upper"; berthCode = "SU"; break;
        default:
          type = "Lower";
          berthCode = "L";
      }

      return {
        id: s.seat_number.toString(), // Keep as string seat number for frontend compatibility
        number: s.seat_number,
        type,
        berthCode,
        isAvailable: s.status === "available" && !reservedSeatIds.has(s.id),
        column: s.col_num,
        row: s.row_num,
      };
    });
  },
};
export default seatService;
