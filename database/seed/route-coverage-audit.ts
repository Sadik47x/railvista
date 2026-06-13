import "./env-loader";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase credentials not found in env.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function runAudit() {
  console.log("================ ROUTE COVERAGE AUDIT ================");

  try {
    // 1. Fetch all stations
    const { data: dbStations, error: stationsErr } = await supabaseAdmin
      .from("stations")
      .select("id, station_code, station_name, city");

    if (stationsErr || !dbStations) {
      throw new Error(`Failed to fetch stations: ${stationsErr?.message}`);
    }

    const stationMap = new Map<string, { code: string; name: string; city: string }>();
    dbStations.forEach((s) => {
      stationMap.set(s.id, { code: s.station_code, name: s.station_name, city: s.city });
    });

    // 2. Fetch all trains
    const { data: dbTrains, error: trainsErr } = await supabaseAdmin
      .from("trains")
      .select("id, train_number, train_name, train_category");

    if (trainsErr || !dbTrains) {
      throw new Error(`Failed to fetch trains: ${trainsErr?.message}`);
    }

    // 3. Fetch all stops ordered by stop_order
    const { data: dbStops, error: stopsErr } = await supabaseAdmin
      .from("train_stations")
      .select("train_id, station_id, stop_order, arrival_time, departure_time, day")
      .order("stop_order", { ascending: true });

    if (stopsErr || !dbStops) {
      throw new Error(`Failed to fetch stops: ${stopsErr?.message}`);
    }

    // Group stops by train_id
    const trainStopsMap = new Map<string, any[]>();
    dbStops.forEach((stop) => {
      if (!trainStopsMap.has(stop.train_id)) {
        trainStopsMap.set(stop.train_id, []);
      }
      trainStopsMap.get(stop.train_id)!.push(stop);
    });

    // 4. Generate all searchable combinations dynamically
    const routeCombinations = new Map<string, Set<string>>(); // key: "FROM_CODE -> TO_CODE", value: Set of train numbers
    let totalCombinationsGenerated = 0;

    dbTrains.forEach((train) => {
      const stops = trainStopsMap.get(train.id) || [];
      // Sort by stop_order to be safe
      stops.sort((a, b) => a.stop_order - b.stop_order);

      // Generate all forward pairs (ts1.stop_order < ts2.stop_order)
      for (let i = 0; i < stops.length; i++) {
        const s1 = stationMap.get(stops[i].station_id);
        if (!s1) continue;

        for (let j = i + 1; j < stops.length; j++) {
          const s2 = stationMap.get(stops[j].station_id);
          if (!s2) continue;

          const routeKey = `${s1.code} → ${s2.code}`;
          if (!routeCombinations.has(routeKey)) {
            routeCombinations.set(routeKey, new Set<string>());
          }
          routeCombinations.get(routeKey)!.add(train.train_number);
          totalCombinationsGenerated++;
        }
      }
    });

    console.log(`\n1. Train Route Audit Complete:`);
    console.log(`   - Total trains audited: ${dbTrains.length}`);
    console.log(`   - Total station stops audited: ${dbStops.length}`);
    console.log(`   - Total unique route combinations: ${routeCombinations.size}`);
    console.log(`   - Total searchable route segments across all trains: ${totalCombinationsGenerated}`);

    // 5. Audit Specific Target Routes for the Same Train (e.g. Vande Bharat 22301)
    const targetPairs = [
      { from: "HWH", to: "PNBE" },
      { from: "PNBE", to: "NDLS" },
      { from: "BSB", to: "NDLS" },
      { from: "HWH", to: "NDLS" },
    ];

    console.log(`\n2. Target Segments Audit:`);
    targetPairs.forEach(({ from, to }) => {
      const key = `${from} → ${to}`;
      const matchingTrainNumbers = Array.from(routeCombinations.get(key) || []);
      const matchingTrainNames = matchingTrainNumbers.map((num) => {
        const t = dbTrains.find((dt) => dt.train_number === num);
        return t ? `${t.train_name} (${t.train_number})` : num;
      });
      console.log(`   * ${key}: Served by ${matchingTrainNames.length} train(s) -> [ ${matchingTrainNames.join(", ")} ]`);
    });

    // Show a sample list of 10 searchable intermediate routes
    console.log(`\n3. Sample of 10 Searchable Route Combinations:`);
    const routesList = Array.from(routeCombinations.entries());
    routesList.slice(0, 10).forEach(([route, trainNums], idx) => {
      console.log(`   ${idx + 1}. ${route} (served by train(s): ${Array.from(trainNums).join(", ")})`);
    });

  } catch (err: any) {
    console.error("Audit failed with exception:", err.message || err);
  }

  console.log("\n=======================================================");
}

runAudit();
