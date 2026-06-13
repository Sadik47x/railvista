// Relational Database Seeder: Coach Generator
import { Database } from "../../src/types/database";

type CoachInsert = Database["public"]["Tables"]["coaches"]["Insert"];

interface SeedTrain {
  id: string;
  train_number: string;
}

export function generateCoaches(trains: SeedTrain[]): CoachInsert[] {
  const coaches: CoachInsert[] = [];

  // Core mock coaches mappings
  const mockCoachesMap: Record<string, { name: string; type: string; seats: number }[]> = {
    "12301": [
      { name: "A1", type: "2A", seats: 48 },
      { name: "A2", type: "2A", seats: 48 },
      { name: "B1", type: "3A", seats: 64 },
      { name: "B2", type: "3A", seats: 64 },
      { name: "B3", type: "3A", seats: 64 },
      { name: "S1", type: "SL", seats: 72 },
    ],
    "12273": [
      { name: "H1", type: "1A", seats: 24 },
      { name: "A1", type: "2A", seats: 48 },
      { name: "B1", type: "3A", seats: 64 },
      { name: "B2", type: "3A", seats: 64 },
    ],
    "22301": [
      { name: "E1", type: "EC", seats: 56 },
      { name: "C1", type: "CC", seats: 78 },
      { name: "C2", type: "CC", seats: 78 },
    ],
  };

  trains.forEach((t) => {
    const mockCoaches = mockCoachesMap[t.train_number];
    if (mockCoaches) {
      mockCoaches.forEach((mc, idx) => {
        const trainPart = t.train_number.padStart(7, "0");
        const coachPart = idx.toString().padStart(5, "0");
        coaches.push({
          id: `8a77da1b-8533-47e0-b6ab-${trainPart}${coachPart}`,
          train_id: t.id,
          coach_name: mc.name,
          coach_type: mc.type,
          seat_count: mc.seats,
        });
      });
    } else {
      // General trains get a standard configuration of 12 coaches
      const coachConfig = [
        { name: "A1", type: "2A", seats: 48 },
        { name: "A2", type: "2A", seats: 48 },
        { name: "B1", type: "3A", seats: 64 },
        { name: "B2", type: "3A", seats: 64 },
        { name: "B3", type: "3A", seats: 64 },
        { name: "B4", type: "3A", seats: 64 },
        { name: "S1", type: "SL", seats: 72 },
        { name: "S2", type: "SL", seats: 72 },
        { name: "S3", type: "SL", seats: 72 },
        { name: "S4", type: "SL", seats: 72 },
        { name: "S5", type: "SL", seats: 72 },
        { name: "S6", type: "SL", seats: 72 },
      ];

      coachConfig.forEach((cfg, idx) => {
        const trainPart = t.train_number.padStart(7, "0");
        const coachPart = (idx + 20).toString().padStart(5, "0"); // Offset index to avoid any overlap
        coaches.push({
          id: `8a77da1b-8533-47e0-b6ab-${trainPart}${coachPart}`,
          train_id: t.id,
          coach_name: cfg.name,
          coach_type: cfg.type,
          seat_count: cfg.seats,
        });
      });
    }
  });

  return coaches;
}
