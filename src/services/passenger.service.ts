import { supabase } from "@/lib/supabase/client";

export interface Passenger {
  id: string;
  bookingId: string;
  fullName: string;
  age: number;
  gender: string;
  berthPreference: string;
  seatNumber: number | null;
}

export const passengerService = {
  async getPassengersForBooking(bookingId: string): Promise<Passenger[]> {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("passengers")
        .select(`
          id,
          booking_id,
          full_name,
          age,
          gender,
          berth_preference,
          seat:seat_id(seat_number)
        `)
        .eq("booking_id", bookingId);

      if (error || !data) {
        console.warn("Error retrieving passengers:", error?.message);
        return [];
      }

      return data.map((p: any) => ({
        id: p.id,
        bookingId: p.booking_id,
        fullName: p.full_name,
        age: p.age,
        gender: p.gender,
        berthPreference: p.berth_preference,
        seatNumber: p.seat ? p.seat.seat_number : null,
      }));
    } catch (err) {
      console.warn("Exception in passenger service:", err);
      return [];
    }
  },
};
export default passengerService;
