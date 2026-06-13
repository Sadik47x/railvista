export interface TrainRouteStop {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  stopDuration: string;
  day: number;
}

export interface CoachClassInfo {
  code: string;
  name: string;
  price: number;
  availableSeats: number;
  status: "available" | "waitlist" | "regret";
  waitlistNumber?: number;
}

export interface Train {
  number: string;
  name: string;
  type: string;
  badge: string;
  badgeType: "success" | "warning" | "info";
  runsOn: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  fromStationCode: string;
  fromStationName: string;
  toStationCode: string;
  toStationName: string;
  classes: CoachClassInfo[];
  route: TrainRouteStop[];
  highlights: string[];
}

export const trains: Train[] = [
  {
    number: "12301",
    name: "Howrah Rajdhani Express",
    type: "Rajdhani",
    badge: "On Time",
    badgeType: "success",
    runsOn: "Daily",
    duration: "17h 05m",
    departureTime: "16:55",
    arrivalTime: "10:00",
    fromStationCode: "HWH",
    fromStationName: "Howrah Jn",
    toStationCode: "NDLS",
    toStationName: "New Delhi",
    highlights: ["Premium Catering", "Linen Included", "High Priority Train"],
    classes: [
      {
        code: "2A",
        name: "AC 2 Tier (2A)",
        price: 2800,
        availableSeats: 12,
        status: "available",
      },
      {
        code: "3A",
        name: "AC 3 Tier (3A)",
        price: 1900,
        availableSeats: 28,
        status: "available",
      },
      {
        code: "SL",
        name: "Sleeper Class (SL)",
        price: 700,
        availableSeats: 0,
        status: "waitlist",
        waitlistNumber: 12,
      },
    ],
    route: [
      { stationCode: "HWH", stationName: "Howrah Jn", arrivalTime: "--:--", departureTime: "16:55", stopDuration: "--", day: 1 },
      { stationCode: "ASN", stationName: "Asansol Jn", arrivalTime: "18:57", departureTime: "18:59", stopDuration: "2m", day: 1 },
      { stationCode: "GAYA", stationName: "Gaya Jn", arrivalTime: "22:10", departureTime: "22:13", stopDuration: "3m", day: 1 },
      { stationCode: "DDU", stationName: "Pt DD Upadhyaya Jn", arrivalTime: "00:55", departureTime: "01:05", stopDuration: "10m", day: 2 },
      { stationCode: "PRYJ", stationName: "Prayagraj Jn", arrivalTime: "03:00", departureTime: "03:02", stopDuration: "2m", day: 2 },
      { stationCode: "CNB", stationName: "Kanpur Central", arrivalTime: "05:20", departureTime: "05:25", stopDuration: "5m", day: 2 },
      { stationCode: "NDLS", stationName: "New Delhi", arrivalTime: "10:00", departureTime: "--:--", stopDuration: "--", day: 2 },
    ],
  },
  {
    number: "12273",
    name: "Howrah Duronto Express",
    type: "Duronto",
    badge: "15m Delay",
    badgeType: "warning",
    runsOn: "Sun, Mon",
    duration: "16h 25m",
    departureTime: "08:35",
    arrivalTime: "01:00",
    fromStationCode: "HWH",
    fromStationName: "Howrah Jn",
    toStationCode: "NDLS",
    toStationName: "New Delhi",
    highlights: ["No Intermediate Commercial Stops", "Fastest Duronto", "Meals Included"],
    classes: [
      {
        code: "1A",
        name: "AC 1 Tier (1A)",
        price: 4200,
        availableSeats: 4,
        status: "available",
      },
      {
        code: "2A",
        name: "AC 2 Tier (2A)",
        price: 3100,
        availableSeats: 0,
        status: "regret",
      },
      {
        code: "3A",
        name: "AC 3 Tier (3A)",
        price: 2100,
        availableSeats: 112,
        status: "available",
      },
    ],
    route: [
      { stationCode: "HWH", stationName: "Howrah Jn", arrivalTime: "--:--", departureTime: "08:35", stopDuration: "--", day: 1 },
      { stationCode: "NDLS", stationName: "New Delhi", arrivalTime: "01:00", departureTime: "--:--", stopDuration: "--", day: 2 },
    ],
  },
  {
    number: "22301",
    name: "HWH NDLS Vande Bharat",
    type: "Vande Bharat",
    badge: "New Launch",
    badgeType: "info",
    runsOn: "Daily except Fri",
    duration: "12h 45m",
    departureTime: "05:55",
    arrivalTime: "18:40",
    fromStationCode: "HWH",
    fromStationName: "Howrah Jn",
    toStationCode: "NDLS",
    toStationName: "New Delhi",
    highlights: ["High Speed Train", "Free Wi-Fi Included", "Executive Lounge Access"],
    classes: [
      {
        code: "EC",
        name: "Executive Chair Car (EC)",
        price: 4900,
        availableSeats: 48,
        status: "available",
      },
      {
        code: "CC",
        name: "AC Chair Car (CC)",
        price: 2800,
        availableSeats: 245,
        status: "available",
      },
    ],
    route: [
      { stationCode: "HWH", stationName: "Howrah Jn", arrivalTime: "--:--", departureTime: "05:55", stopDuration: "--", day: 1 },
      { stationCode: "PNBE", stationName: "Patna Jn", arrivalTime: "11:20", departureTime: "11:30", stopDuration: "10m", day: 1 },
      { stationCode: "BSB", stationName: "Varanasi Jn", arrivalTime: "14:45", departureTime: "14:55", stopDuration: "10m", day: 1 },
      { stationCode: "NDLS", stationName: "New Delhi", arrivalTime: "18:40", departureTime: "--:--", stopDuration: "--", day: 1 },
    ],
  },
];
