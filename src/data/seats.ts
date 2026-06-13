export interface Seat {
  id: string;
  number: number;
  type: "Lower" | "Middle" | "Upper" | "Side Lower" | "Side Upper";
  berthCode: "L" | "M" | "U" | "SL" | "SU";
  isAvailable: boolean;
  column: number; // 1, 2, 3, or 5 (4 is aisle gap)
  row: number;
}

export const generateSeatsForCoach = (coachId: string): Seat[] => {
  const seats: Seat[] = [];
  const totalSeats = 64; // Standard AC 3 Tier (3A) coach
  const compartments = totalSeats / 8; // 8 compartments of 8 berths each

  // Seed reproducibility using coachId characters
  const getAvailability = (num: number) => {
    const charSum = coachId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const val = (num + charSum) % 7;
    // Return true for available (about 60% of seats)
    return val !== 0 && val !== 3 && val !== 5;
  };

  for (let c = 0; c < compartments; c++) {
    const base = c * 8;
    // Left side: 3 berths (Lower, Middle, Upper)
    seats.push({
      id: `${base + 1}`,
      number: base + 1,
      type: "Lower",
      berthCode: "L",
      isAvailable: getAvailability(base + 1),
      column: 1,
      row: 2 * c,
    });
    seats.push({
      id: `${base + 2}`,
      number: base + 2,
      type: "Middle",
      berthCode: "M",
      isAvailable: getAvailability(base + 2),
      column: 2,
      row: 2 * c,
    });
    seats.push({
      id: `${base + 3}`,
      number: base + 3,
      type: "Upper",
      berthCode: "U",
      isAvailable: getAvailability(base + 3),
      column: 3,
      row: 2 * c,
    });

    // Right side: 3 berths (Lower, Middle, Upper)
    seats.push({
      id: `${base + 4}`,
      number: base + 4,
      type: "Lower",
      berthCode: "L",
      isAvailable: getAvailability(base + 4),
      column: 1,
      row: 2 * c + 1,
    });
    seats.push({
      id: `${base + 5}`,
      number: base + 5,
      type: "Middle",
      berthCode: "M",
      isAvailable: getAvailability(base + 5),
      column: 2,
      row: 2 * c + 1,
    });
    seats.push({
      id: `${base + 6}`,
      number: base + 6,
      type: "Upper",
      berthCode: "U",
      isAvailable: getAvailability(base + 6),
      column: 3,
      row: 2 * c + 1,
    });

    // Side berths: 2 berths (Side Lower, Side Upper)
    seats.push({
      id: `${base + 7}`,
      number: base + 7,
      type: "Side Lower",
      berthCode: "SL",
      isAvailable: getAvailability(base + 7),
      column: 5,
      row: 2 * c,
    });
    seats.push({
      id: `${base + 8}`,
      number: base + 8,
      type: "Side Upper",
      berthCode: "SU",
      isAvailable: getAvailability(base + 8),
      column: 5,
      row: 2 * c + 1,
    });
  }

  return seats;
};
