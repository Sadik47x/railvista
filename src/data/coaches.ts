export interface Coach {
  id: string;
  classCode: string;
  className: string;
  totalSeats: number;
}

export const trainCoaches: Record<string, Coach[]> = {
  "12301": [
    { id: "A1", classCode: "2A", className: "AC 2 Tier (2A)", totalSeats: 48 },
    { id: "A2", classCode: "2A", className: "AC 2 Tier (2A)", totalSeats: 48 },
    { id: "B1", classCode: "3A", className: "AC 3 Tier (3A)", totalSeats: 64 },
    { id: "B2", classCode: "3A", className: "AC 3 Tier (3A)", totalSeats: 64 },
    { id: "B3", classCode: "3A", className: "AC 3 Tier (3A)", totalSeats: 64 },
    { id: "S1", classCode: "SL", className: "Sleeper Class (SL)", totalSeats: 72 },
  ],
  "12273": [
    { id: "H1", classCode: "1A", className: "AC 1 Tier (1A)", totalSeats: 24 },
    { id: "A1", classCode: "2A", className: "AC 2 Tier (2A)", totalSeats: 48 },
    { id: "B1", classCode: "3A", className: "AC 3 Tier (3A)", totalSeats: 64 },
    { id: "B2", classCode: "3A", className: "AC 3 Tier (3A)", totalSeats: 64 },
  ],
  "22301": [
    { id: "E1", classCode: "EC", className: "Executive Chair Car (EC)", totalSeats: 56 },
    { id: "C1", classCode: "CC", className: "AC Chair Car (CC)", totalSeats: 78 },
    { id: "C2", classCode: "CC", className: "AC Chair Car (CC)", totalSeats: 78 },
  ],
};
