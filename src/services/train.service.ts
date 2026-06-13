import { supabase } from "@/lib/supabase/client";
import { trains as mockTrains, Train } from "@/data/trains";

// Base prices matching the mock data system
const CLASS_PRICES: Record<string, number> = {
  "1A": 4200,
  "2A": 2800,
  "3A": 1900,
  "SL": 700,
  "CC": 2800,
  "EC": 4900,
};

function formatDateToISO(dateStr: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
  } catch (e) {
    // Ignore
  }
  return "2026-07-15"; // Fallback default
}


export const trainService = {
  async getTrains(fromCode: string, toCode: string, journeyDate: string = "2026-07-15"): Promise<Train[]> {
    if (!supabase) {
      return this.filterMockTrains(fromCode, toCode);
    }

    const startTime = performance.now();
    const formattedDate = formatDateToISO(journeyDate);
    console.log(`[SQL RPC CALL] get_trains_by_route: from=${fromCode}, to=${toCode}`);
    try {
      // 1. Call SQL RPC to get matching trains by route (filtering at SQL level)
      const { data: dbTrains, error: trainErr } = await supabase.rpc(
        "get_trains_by_route",
        {
          p_from_code: fromCode,
          p_to_code: toCode,
        }
      );

      if (trainErr || !dbTrains || dbTrains.length === 0) {
        console.warn("Error/no trains matching route, using fallback:", trainErr?.message);
        return [];
      }

      const trainIds = dbTrains.map((t) => t.id);

      // 2. Fetch train stops in batch using .in("train_id", trainIds)
      const { data: allStops, error: routeErr } = await supabase
        .from("train_stations")
        .select(`
          train_id,
          arrival_time,
          departure_time,
          stop_duration,
          stop_order,
          day,
          station:station_id(station_code, station_name)
        `)
        .in("train_id", trainIds)
        .order("stop_order", { ascending: true });

      if (routeErr || !allStops) {
        console.warn("Error fetching stops in batch:", routeErr?.message);
        return [];
      }

      // 3. Call get_train_class_summaries RPC in one query to fetch availability
      console.log(`[SQL RPC CALL] get_train_class_summaries: trainIdsCount=${trainIds.length}, journeyDate=${formattedDate}`);
      const { data: classSummaries, error: classErr } = await supabase.rpc(
        "get_train_class_summaries",
        {
          p_train_ids: trainIds,
          p_journey_date: formattedDate,
        }
      );

      if (classErr || !classSummaries) {
        console.warn("Error fetching seat summaries:", classErr?.message);
        return [];
      }

      const results: Train[] = [];

      for (const t of dbTrains) {
        // Filter stops for this train
        const stopsForTrain = allStops.filter((s) => s.train_id === t.id);
        const routeStops = stopsForTrain.map((s: any) => ({
          stationCode: s.station.station_code,
          stationName: s.station.station_name,
          arrivalTime: s.arrival_time,
          departureTime: s.departure_time,
          stopDuration: s.stop_duration,
          day: s.day,
        }));

        // Filter seat class summaries for this train
        const summariesForTrain = classSummaries.filter((c) => c.train_id === t.id);
        const classesList = summariesForTrain.map((summary) => {
          const status = summary.available_seats > 0 ? ("available" as const) : ("waitlist" as const);
          const code = summary.coach_type;
          return {
            code,
            name: `${code === "3A" ? "AC 3 Tier" : code === "2A" ? "AC 2 Tier" : code === "1A" ? "AC 1 Tier" : code === "EC" ? "Executive Chair Car" : code === "CC" ? "AC Chair Car" : "Sleeper Class"} (${code})`,
            price: CLASS_PRICES[code] || 1500,
            availableSeats: Number(summary.available_seats),
            status,
            waitlistNumber: status === "waitlist" ? 15 : undefined,
          };
        });

        // Resolve searched segment timings if not 'ANY'
        let departureTime = t.departure_time;
        let arrivalTime = t.arrival_time;
        let fromStationCode = t.source_station_code;
        let fromStationName = t.source_station_name;
        let toStationCode = t.destination_station_code;
        let toStationName = t.destination_station_name;
        let segmentDurationMinutes = t.duration_minutes;

        if (fromCode !== "ANY" && toCode !== "ANY") {
          const fromStop = routeStops.find((s) => s.stationCode === fromCode);
          const toStop = routeStops.find((s) => s.stationCode === toCode);

          if (fromStop && toStop) {
            departureTime = fromStop.departureTime;
            arrivalTime = toStop.arrivalTime;
            fromStationCode = fromStop.stationCode;
            fromStationName = fromStop.stationName;
            toStationCode = toStop.stationCode;
            toStationName = toStop.stationName;

            // Calculate duration in minutes
            try {
              const [depHrs, depMins] = departureTime.split(":").map(Number);
              const [arrHrs, arrMins] = arrivalTime.split(":").map(Number);
              
              const depTotal = fromStop.day * 1440 + depHrs * 60 + depMins;
              const arrTotal = toStop.day * 1440 + arrHrs * 60 + arrMins;
              segmentDurationMinutes = arrTotal - depTotal;
            } catch (e) {
              // Fallback
            }
          }
        }

        const hrs = Math.floor(segmentDurationMinutes / 60);
        const mins = segmentDurationMinutes % 60;
        const durationStr = `${hrs}h ${mins.toString().padStart(2, "0")}m`;

        results.push({
          number: t.train_number,
          name: t.train_name,
          type: t.train_category,
          badge: "On Time",
          badgeType: "success",
          runsOn: t.runs_on,
          duration: durationStr,
          departureTime: departureTime,
          arrivalTime: arrivalTime,
          fromStationCode: fromStationCode,
          fromStationName: fromStationName,
          toStationCode: toStationCode,
          toStationName: toStationName,
          highlights: t.train_category === "Rajdhani" || t.train_category === "Vande Bharat"
            ? ["Premium Catering", "Linen Included", "High Priority Train"]
            : ["Fast Transit", "Express Service"],
          classes: classesList,
          route: routeStops,
        });
      }

      const duration = performance.now() - startTime;
      console.log(`[PERFORMANCE LOG] Search Duration: ${duration.toFixed(2)}ms`);

      return results;
    } catch (err) {
      console.warn("Supabase trains query exception, using fallback:", err);
      return this.filterMockTrains(fromCode, toCode);
    }
  },

  async getTrainByNumber(num: string, journeyDate: string = "2026-07-15"): Promise<Train | null> {
    if (!supabase) {
      return mockTrains.find((t) => t.number === num) || null;
    }

    const startTime = performance.now();
    try {
      // 1. Fetch train directly by train_number
      const { data: t, error: trainErr } = await supabase
        .from("trains")
        .select(`
          id,
          train_number,
          train_name,
          train_category,
          departure_time,
          arrival_time,
          duration_minutes,
          runs_on,
          source_station:source_station_id(station_code, station_name),
          destination_station:destination_station_id(station_code, station_name)
        `)
        .eq("train_number", num)
        .maybeSingle();

      if (trainErr || !t) {
        console.warn("Could not find train by number:", num);
        return mockTrains.find((train) => train.number === num) || null;
      }

      // 2. Fetch stops for this single train
      const { data: stops, error: routeErr } = await supabase
        .from("train_stations")
        .select(`
          arrival_time,
          departure_time,
          stop_duration,
          stop_order,
          day,
          station:station_id(station_code, station_name)
        `)
        .eq("train_id", t.id)
        .order("stop_order", { ascending: true });

      if (routeErr || !stops) {
        console.warn("Error fetching stops for train:", num);
        return null;
      }

      const routeStops = stops.map((s: any) => ({
        stationCode: s.station.station_code,
        stationName: s.station.station_name,
        arrivalTime: s.arrival_time,
        departureTime: s.departure_time,
        stopDuration: s.stop_duration,
        day: s.day,
      }));

      // 3. Call class summaries RPC for this train ID
      const formattedDate = formatDateToISO(journeyDate);
      console.log(`[SQL RPC CALL] get_train_class_summaries (single train): trainId=${t.id}, journeyDate=${formattedDate}`);
      const { data: classSummaries, error: classErr } = await supabase.rpc(
        "get_train_class_summaries",
        {
          p_train_ids: [t.id],
          p_journey_date: formattedDate,
        }
      );

      if (classErr || !classSummaries) {
        console.warn("Error fetching seat summaries for train:", num);
        return null;
      }

      const classesList = classSummaries.map((summary) => {
        const status = summary.available_seats > 0 ? ("available" as const) : ("waitlist" as const);
        const code = summary.coach_type;
        return {
          code,
          name: `${code === "3A" ? "AC 3 Tier" : code === "2A" ? "AC 2 Tier" : code === "1A" ? "AC 1 Tier" : code === "EC" ? "Executive Chair Car" : code === "CC" ? "AC Chair Car" : "Sleeper Class"} (${code})`,
          price: CLASS_PRICES[code] || 1500,
          availableSeats: Number(summary.available_seats),
          status,
          waitlistNumber: status === "waitlist" ? 15 : undefined,
        };
      });

      const hrs = Math.floor(t.duration_minutes / 60);
      const mins = t.duration_minutes % 60;
      const durationStr = `${hrs}h ${mins.toString().padStart(2, "0")}m`;

      const duration = performance.now() - startTime;
      console.log(`[PERFORMANCE LOG] Train Details Duration: ${duration.toFixed(2)}ms`);

      return {
        number: t.train_number,
        name: t.train_name,
        type: t.train_category,
        badge: "On Time",
        badgeType: "success",
        runsOn: t.runs_on,
        duration: durationStr,
        departureTime: t.departure_time,
        arrivalTime: t.arrival_time,
        fromStationCode: (t.source_station as any).station_code,
        fromStationName: (t.source_station as any).station_name,
        toStationCode: (t.destination_station as any).station_code,
        toStationName: (t.destination_station as any).station_name,
        highlights: t.train_category === "Rajdhani" || t.train_category === "Vande Bharat"
          ? ["Premium Catering", "Linen Included", "High Priority Train"]
          : ["Fast Transit", "Express Service"],
        classes: classesList,
        route: routeStops,
      };
    } catch (err) {
      console.warn("Exception in getTrainByNumber:", err);
      return mockTrains.find((train) => train.number === num) || null;
    }
  },

  // Helper filter for mock data fallback
  filterMockTrains(fromCode: string, toCode: string): Train[] {
    if (fromCode === "ANY" || toCode === "ANY") {
      return mockTrains;
    }
    return mockTrains.filter((train) => {
      const fromIndex = train.route.findIndex((s) => s.stationCode === fromCode);
      const toIndex = train.route.findIndex((s) => s.stationCode === toCode);
      return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
    });
  },
};
export default trainService;
