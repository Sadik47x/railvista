import { supabase } from "@/lib/supabase/client";
import { stations as mockStations, Station } from "@/data/stations";

export const stationService = {
  async getStations(): Promise<Station[]> {
    if (!supabase) {
      return mockStations;
    }

    try {
      const { data, error } = await supabase
        .from("stations")
        .select("station_code, station_name, city")
        .order("station_name", { ascending: true });

      if (error) {
        console.warn("Supabase stations query error, using fallback:", error.message);
        return mockStations;
      }

      if (!data || data.length === 0) {
        return mockStations;
      }

      return data.map((row) => ({
        code: row.station_code,
        name: row.station_name,
        city: row.city,
      }));
    } catch (err) {
      console.warn("Supabase stations query exception, using fallback:", err);
      return mockStations;
    }
  },

  async getStationByCode(code: string): Promise<Station | null> {
    if (!supabase) {
      return mockStations.find((s) => s.code === code) || null;
    }

    try {
      const { data, error } = await supabase
        .from("stations")
        .select("station_code, station_name, city")
        .eq("station_code", code)
        .maybeSingle();

      if (error || !data) {
        return mockStations.find((s) => s.code === code) || null;
      }

      return {
        code: data.station_code,
        name: data.station_name,
        city: data.city,
      };
    } catch (err) {
      return mockStations.find((s) => s.code === code) || null;
    }
  },
};
export default stationService;
