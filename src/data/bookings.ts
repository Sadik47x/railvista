export interface BookingPassenger {
  name: string;
  age: number;
  gender: string;
  seatNumber: string;
  berthType: string;
}

export interface Booking {
  id: string; // PNR Number
  pnr: string;
  trainNumber: string;
  trainName: string;
  fromStationCode: string;
  fromStationName: string;
  toStationCode: string;
  toStationName: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  classCode: string;
  coachId: string;
  seats: string[];
  passengers: BookingPassenger[];
  totalAmount: number;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "PENDING";
  bookingDate: string;
}

export const mockBookings: Booking[] = [
  {
    id: "4239840291",
    pnr: "423-9840291",
    trainNumber: "12301",
    trainName: "Howrah Rajdhani Express",
    fromStationCode: "HWH",
    fromStationName: "Howrah Jn",
    toStationCode: "NDLS",
    toStationName: "New Delhi",
    departureTime: "16:55",
    arrivalTime: "10:00",
    date: "15 July 2026",
    classCode: "3A",
    coachId: "B2",
    seats: ["22", "23"],
    passengers: [
      { name: "Siddharth Sharma", age: 28, gender: "Male", seatNumber: "22", berthType: "Lower" },
      { name: "Pooja Sharma", age: 26, gender: "Female", seatNumber: "23", berthType: "Middle" },
    ],
    totalAmount: 3800,
    status: "CONFIRMED",
    bookingDate: "10 June 2026",
  },
  {
    id: "2849182390",
    pnr: "284-9182390",
    trainNumber: "22301",
    trainName: "HWH NDLS Vande Bharat",
    fromStationCode: "NDLS",
    fromStationName: "New Delhi",
    toStationCode: "HWH",
    toStationName: "Howrah Jn",
    departureTime: "05:55",
    arrivalTime: "18:40",
    date: "22 May 2026",
    classCode: "CC",
    coachId: "C1",
    seats: ["14"],
    passengers: [
      { name: "Siddharth Sharma", age: 28, gender: "Male", seatNumber: "14", berthType: "Window Chair" },
    ],
    totalAmount: 2800,
    status: "COMPLETED",
    bookingDate: "15 May 2026",
  },
];
