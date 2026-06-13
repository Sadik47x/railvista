// Relational Database Seeder: Seat Generator
import { Database } from "../../src/types/database";

type SeatInsert = Database["public"]["Tables"]["seats"]["Insert"];

interface SeedCoach {
  id: string;
  coach_type: string;
  seat_count: number;
}

export function generateSeatsForCoach(coach: SeedCoach): SeatInsert[] {
  const seats: SeatInsert[] = [];
  const totalSeats = coach.seat_count;
  const type = coach.coach_type;

  // AC 3 Tier (3A) and Sleeper (SL) layout - Compartments of 8 seats
  if (type === "3A" || type === "SL") {
    const compartments = Math.ceil(totalSeats / 8);
    for (let c = 0; c < compartments; c++) {
      const base = c * 8;
      
      const seatsToGenerate = [
        { num: 1, berth: "LB", col: 1, row: 2 * c },
        { num: 2, berth: "MB", col: 2, row: 2 * c },
        { num: 3, berth: "UB", col: 3, row: 2 * c },
        { num: 4, berth: "LB", col: 1, row: 2 * c + 1 },
        { num: 5, berth: "MB", col: 2, row: 2 * c + 1 },
        { num: 6, berth: "UB", col: 3, row: 2 * c + 1 },
        { num: 7, berth: "SL", col: 5, row: 2 * c },
        { num: 8, berth: "SU", col: 5, row: 2 * c + 1 },
      ];

      for (const s of seatsToGenerate) {
        const seatNum = base + s.num;
        if (seatNum <= totalSeats) {
          seats.push({
            coach_id: coach.id,
            seat_number: seatNum,
            berth_type: s.berth,
            status: getInitialStatus(seatNum),
            row_num: s.row,
            col_num: s.col,
          });
        }
      }
    }
  } 
  // AC 2 Tier (2A) layout - Compartments of 6 seats (no middle berths)
  else if (type === "2A") {
    const compartments = Math.ceil(totalSeats / 6);
    for (let c = 0; c < compartments; c++) {
      const base = c * 6;
      
      const seatsToGenerate = [
        { num: 1, berth: "LB", col: 1, row: 2 * c },
        { num: 2, berth: "UB", col: 3, row: 2 * c },
        { num: 3, berth: "LB", col: 1, row: 2 * c + 1 },
        { num: 4, berth: "UB", col: 3, row: 2 * c + 1 },
        { num: 5, berth: "SL", col: 5, row: 2 * c },
        { num: 6, berth: "SU", col: 5, row: 2 * c + 1 },
      ];

      for (const s of seatsToGenerate) {
        const seatNum = base + s.num;
        if (seatNum <= totalSeats) {
          seats.push({
            coach_id: coach.id,
            seat_number: seatNum,
            berth_type: s.berth,
            status: getInitialStatus(seatNum),
            row_num: s.row,
            col_num: s.col,
          });
        }
      }
    }
  } 
  // AC 1 Tier (1A) layout - Coupes of 4 seats (LB, UB only, no side berths)
  else if (type === "1A") {
    const compartments = Math.ceil(totalSeats / 4);
    for (let c = 0; c < compartments; c++) {
      const base = c * 4;
      
      const seatsToGenerate = [
        { num: 1, berth: "LB", col: 1, row: 2 * c },
        { num: 2, berth: "UB", col: 3, row: 2 * c },
        { num: 3, berth: "LB", col: 1, row: 2 * c + 1 },
        { num: 4, berth: "UB", col: 3, row: 2 * c + 1 },
      ];

      for (const s of seatsToGenerate) {
        const seatNum = base + s.num;
        if (seatNum <= totalSeats) {
          seats.push({
            coach_id: coach.id,
            seat_number: seatNum,
            berth_type: s.berth,
            status: getInitialStatus(seatNum),
            row_num: s.row,
            col_num: s.col,
          });
        }
      }
    }
  } 
  // Chair Car (CC / EC) layout - Rows of 5 seats (3+2 layout)
  else {
    const rows = Math.ceil(totalSeats / 5);
    for (let r = 0; r < rows; r++) {
      const base = r * 5;
      
      const seatsToGenerate = [
        { num: 1, berth: "WS", col: 1, row: r }, // Window Seat Left
        { num: 2, berth: "MS", col: 2, row: r }, // Middle Seat Left
        { num: 3, berth: "AS", col: 3, row: r }, // Aisle Seat Left
        { num: 4, berth: "AS", col: 5, row: r }, // Aisle Seat Right
        { num: 5, berth: "WS", col: 6, row: r }, // Window Seat Right (col 4 is aisle gap)
      ];

      for (const s of seatsToGenerate) {
        const seatNum = base + s.num;
        if (seatNum <= totalSeats) {
          seats.push({
            coach_id: coach.id,
            seat_number: seatNum,
            berth_type: s.berth,
            status: getInitialStatus(seatNum),
            row_num: s.row,
            col_num: s.col,
          });
        }
      }
    }
  }

  return seats;
}

// Randomly distribute status (65% available, 30% booked, 5% blocked)
function getInitialStatus(seatNum: number): string {
  const val = seatNum % 10;
  if (val === 0 || val === 4 || val === 8) {
    return "booked";
  }
  if (val === 6) {
    return "blocked";
  }
  return "available";
}
