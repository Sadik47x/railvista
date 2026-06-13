import { supabase } from "@/lib/supabase/client";
import { trainCoaches as mockTrainCoaches, Coach } from "@/data/coaches";

export const coachService = {
  async getCoachesForTrain(trainNumber: string): Promise<Coach[]> {
    if (!supabase) {
      return mockTrainCoaches[trainNumber] || [];
    }

    try {
      // 1. Resolve train ID from train number
      const { data: train, error: trainErr } = await supabase
        .from("trains")
        .select("id")
        .eq("train_number", trainNumber)
        .maybeSingle();

      if (trainErr || !train) {
        console.warn("Could not find train for coaches, using mock:", trainNumber);
        return mockTrainCoaches[trainNumber] || [];
      }

      // 2. Fetch coaches associated with this train
      const { data: dbCoaches, error: coachErr } = await supabase
        .from("coaches")
        .select("id, coach_name, coach_type, seat_count")
        .eq("train_id", train.id);

      if (coachErr || !dbCoaches || dbCoaches.length === 0) {
        return mockTrainCoaches[trainNumber] || [];
      }

      return dbCoaches.map((c) => {
        let className = "";
        switch (c.coach_type) {
          case "1A": className = "AC 1 Tier (1A)"; break;
          case "2A": className = "AC 2 Tier (2A)"; break;
          case "3A": className = "AC 3 Tier (3A)"; break;
          case "SL": className = "Sleeper Class (SL)"; break;
          case "CC": className = "AC Chair Car (CC)"; break;
          case "EC": className = "Executive Chair Car (EC)"; break;
          default: className = `${c.coach_type} Class`;
        }

        return {
          id: c.coach_name, // e.g. "B2"
          classCode: c.coach_type, // e.g. "3A"
          className,
          totalSeats: c.seat_count,
        };
      });
    } catch (err) {
      console.warn("Exception in coach service, using mock:", err);
      return mockTrainCoaches[trainNumber] || [];
    }
  },
};
export default coachService;
