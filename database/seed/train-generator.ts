// Relational Database Seeder: Train Generator
import { Database } from "../../src/types/database";

type TrainInsert = Database["public"]["Tables"]["trains"]["Insert"];
type TrainStationInsert = Database["public"]["Tables"]["train_stations"]["Insert"];

interface SeedStation {
  id: string;
  station_code: string;
  station_name: string;
  city: string;
}

const CATEGORIES = ["Rajdhani", "Duronto", "Vande Bharat", "Superfast", "Express", "Shatabdi"];
const RUNS_OPTIONS = ["Daily", "Daily except Sun", "Mon, Wed, Fri", "Tue, Thu, Sat", "Daily except Fri"];

export function generateTrains(
  stations: SeedStation[]
): { trains: TrainInsert[]; stops: TrainStationInsert[] } {
  const trains: TrainInsert[] = [];
  const stops: TrainStationInsert[] = [];

  // Ensure we seed the 3 mock trains first to keep existing queries functional
  const hwh = stations.find((s) => s.station_code === "HWH")!;
  const ndls = stations.find((s) => s.station_code === "NDLS")!;
  const pnbe = stations.find((s) => s.station_code === "PNBE")!;
  const bsb = stations.find((s) => s.station_code === "BSB")!;
  const cnb = stations.find((s) => s.station_code === "CNB")!;

  const mockTrainData = [
    {
      id: "9766da1b-8533-47e0-b6ab-db23d9178bf1",
      train_number: "12301",
      train_name: "Howrah Rajdhani Express",
      train_category: "Rajdhani",
      source_station_id: hwh.id,
      destination_station_id: ndls.id,
      departure_time: "16:55",
      arrival_time: "10:00",
      duration_minutes: 1025, // 17h 05m
      runs_on: "Daily",
      stops: [
        { station_id: hwh.id, arrival_time: "--:--", departure_time: "16:55", stop_duration: "--", stop_order: 1, day: 1 },
        { station_id: cnb.id, arrival_time: "05:20", departure_time: "05:25", stop_duration: "5m", stop_order: 2, day: 2 },
        { station_id: ndls.id, arrival_time: "10:00", departure_time: "--:--", stop_duration: "--", stop_order: 3, day: 2 },
      ],
    },
    {
      id: "9766da1b-8533-47e0-b6ab-db23d9178bf2",
      train_number: "12273",
      train_name: "Howrah Duronto Express",
      train_category: "Duronto",
      source_station_id: hwh.id,
      destination_station_id: ndls.id,
      departure_time: "08:35",
      arrival_time: "01:00",
      duration_minutes: 985, // 16h 25m
      runs_on: "Sun, Mon",
      stops: [
        { station_id: hwh.id, arrival_time: "--:--", departure_time: "08:35", stop_duration: "--", stop_order: 1, day: 1 },
        { station_id: ndls.id, arrival_time: "01:00", departure_time: "--:--", stop_duration: "--", stop_order: 2, day: 2 },
      ],
    },
    {
      id: "9766da1b-8533-47e0-b6ab-db23d9178bf3",
      train_number: "22301",
      train_name: "HWH NDLS Vande Bharat",
      train_category: "Vande Bharat",
      source_station_id: hwh.id,
      destination_station_id: ndls.id,
      departure_time: "05:55",
      arrival_time: "18:40",
      duration_minutes: 765, // 12h 45m
      runs_on: "Daily except Fri",
      stops: [
        { station_id: hwh.id, arrival_time: "--:--", departure_time: "05:55", stop_duration: "--", stop_order: 1, day: 1 },
        { station_id: pnbe.id, arrival_time: "11:20", departure_time: "11:30", stop_duration: "10m", stop_order: 2, day: 1 },
        { station_id: bsb.id, arrival_time: "14:45", departure_time: "14:55", stop_duration: "10m", stop_order: 3, day: 1 },
        { station_id: ndls.id, arrival_time: "18:40", departure_time: "--:--", stop_duration: "--", stop_order: 4, day: 1 },
      ],
    },
  ];

  for (const m of mockTrainData) {
    const { stops: tStops, ...tData } = m;
    trains.push(tData);
    for (const s of tStops) {
      stops.push({
        train_id: tData.id,
        station_id: s.station_id,
        arrival_time: s.arrival_time,
        departure_time: s.departure_time,
        stop_duration: s.stop_duration,
        stop_order: s.stop_order,
        day: s.day,
      });
    }
  }

  // Generate 47 more trains to make exactly 50
  for (let i = 1; i <= 47; i++) {
    const trainId = `9766da1b-8533-47e0-b6ab-db23d9178b${(i + 10).toString(16).padStart(2, "0")}`;
    const category = CATEGORIES[i % CATEGORIES.length];
    const runsOn = RUNS_OPTIONS[i % RUNS_OPTIONS.length];

    // Pick source and destination stations (ensure they are different)
    const srcIndex = (i * 3) % stations.length;
    let destIndex = (i * 7) % stations.length;
    if (srcIndex === destIndex) {
      destIndex = (destIndex + 1) % stations.length;
    }

    const source = stations[srcIndex];
    const dest = stations[destIndex];
    const trainNum = (12000 + i).toString();
    const trainName = `${source.city} - ${dest.city} ${category}`;

    const departureHour = 5 + (i % 18); // 05:00 to 22:00
    const departureMin = (i * 5) % 60;
    const depTime = `${departureHour.toString().padStart(2, "0")}:${departureMin.toString().padStart(2, "0")}`;

    const durationHrs = 8 + (i % 16); // 8 to 23 hours
    const durationMins = (i * 10) % 60;
    const duration = durationHrs * 60 + durationMins;

    const arrHour = (departureHour + durationHrs) % 24;
    const arrMin = (departureMin + durationMins) % 60;
    const arrTime = `${arrHour.toString().padStart(2, "0")}:${arrMin.toString().padStart(2, "0")}`;
    const day = departureHour + durationHrs >= 24 ? 2 : 1;

    trains.push({
      id: trainId,
      train_number: trainNum,
      train_name: trainName,
      train_category: category,
      source_station_id: source.id,
      destination_station_id: dest.id,
      departure_time: depTime,
      arrival_time: arrTime,
      duration_minutes: duration,
      runs_on: runsOn,
    });

    // Generate stops (at least source and destination, optionally 2 intermediate stops)
    const stopCount = 2 + (i % 3); // 2 to 4 stops
    const stopsList: SeedStation[] = [source];

    // Add intermediate stops
    for (let k = 1; k < stopCount - 1; k++) {
      const stopStation = stations[(srcIndex + k * 2) % stations.length];
      if (stopStation.id !== source.id && stopStation.id !== dest.id) {
        stopsList.push(stopStation);
      }
    }
    stopsList.push(dest);

    // Map stop times sequentially
    stopsList.forEach((station, idx) => {
      const isStart = idx === 0;
      const isEnd = idx === stopsList.length - 1;

      let arr = "--:--";
      let dep = "--:--";
      let dur = "--";

      if (isStart) {
        dep = depTime;
      } else if (isEnd) {
        arr = arrTime;
      } else {
        const offsetHrs = Math.floor((durationHrs / stopsList.length) * idx);
        const stopHour = (departureHour + offsetHrs) % 24;
        const stopMin = (departureMin + idx * 10) % 60;
        arr = `${stopHour.toString().padStart(2, "0")}:${stopMin.toString().padStart(2, "0")}`;
        // stop for 5 minutes
        const depMin = (stopMin + 5) % 60;
        const depHour = stopMin + 5 >= 60 ? (stopHour + 1) % 24 : stopHour;
        dep = `${depHour.toString().padStart(2, "0")}:${depMin.toString().padStart(2, "0")}`;
        dur = "5m";
      }

      stops.push({
        train_id: trainId,
        station_id: station.id,
        arrival_time: arr,
        departure_time: dep,
        stop_duration: dur,
        stop_order: idx + 1,
        day: idx === 0 ? 1 : day,
      });
    });
  }

  return { trains, stops };
}
