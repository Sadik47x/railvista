// Relational Database Seeder: Coordinator
import "./env-loader";
import { supabaseAdmin, isSupabaseAdminConfigured } from "../../src/lib/supabase/admin";
import { generateStations } from "./station-generator";
import { generateTrains } from "./train-generator";
import { generateCoaches } from "./coach-generator";
import { generateSeatsForCoach } from "./seat-generator";

async function runSeeder() {
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    console.error("Supabase Admin client is not configured. Please supply NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  console.log("Starting RailVista Database Seed Operation...");

  try {
    // 1. Clean existing records in reverse dependency order
    console.log("Cleaning existing database records...");
    await supabaseAdmin.from("passengers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("bookings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("seats").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("coaches").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("train_stations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("trains").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseAdmin.from("stations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    console.log("Database cleanup complete.");

    // 2. Generate and Insert Stations
    console.log("Generating 100 stations...");
    const stationData = generateStations();
    const { data: insertedStations, error: stationErr } = await supabaseAdmin
      .from("stations")
      .insert(stationData)
      .select("id, station_code, station_name, city");

    if (stationErr || !insertedStations) {
      throw new Error(`Failed to seed stations: ${stationErr?.message}`);
    }
    console.log(`Successfully seeded ${insertedStations.length} stations.`);

    // 3. Generate and Insert Trains and Stops
    console.log("Generating 50 trains and route schedules...");
    const { trains, stops } = generateTrains(insertedStations);
    
    const { data: insertedTrains, error: trainErr } = await supabaseAdmin
      .from("trains")
      .insert(trains)
      .select("id, train_number");

    if (trainErr || !insertedTrains) {
      throw new Error(`Failed to seed trains: ${trainErr?.message}`);
    }
    console.log(`Successfully seeded ${insertedTrains.length} trains.`);

    // Match generated stop train_ids to actual inserted train IDs
    const finalStops = stops.map((s) => {
      const train = insertedTrains.find((t) => t.id === s.train_id);
      return {
        ...s,
        train_id: train!.id,
      };
    });

    console.log(`Inserting ${finalStops.length} route stops...`);
    const { error: stopsErr } = await supabaseAdmin.from("train_stations").insert(finalStops);
    if (stopsErr) {
      throw new Error(`Failed to seed train stations: ${stopsErr.message}`);
    }
    console.log("Successfully seeded train route timeline schedule stops.");

    // 4. Generate and Insert Coaches
    console.log("Generating coaches for all trains...");
    const coachData = generateCoaches(insertedTrains);
    const { data: insertedCoaches, error: coachErr } = await supabaseAdmin
      .from("coaches")
      .insert(coachData)
      .select("id, coach_type, seat_count");

    if (coachErr || !insertedCoaches) {
      throw new Error(`Failed to seed coaches: ${coachErr?.message}`);
    }
    console.log(`Successfully seeded ${insertedCoaches.length} coaches.`);

    // 5. Generate and Insert Seats in Batches
    console.log("Generating seats (LB/MB/UB/SL/SU) for all coaches...");
    const seatData: any[] = [];
    insertedCoaches.forEach((c) => {
      const seats = generateSeatsForCoach(c);
      seatData.push(...seats);
    });

    console.log(`Bulk inserting ${seatData.length} seats (batching by 1000)...`);
    const batchSize = 1000;
    for (let i = 0; i < seatData.length; i += batchSize) {
      const batch = seatData.slice(i, i + batchSize);
      const { error: seatInsertErr } = await supabaseAdmin.from("seats").insert(batch);
      if (seatInsertErr) {
        throw new Error(`Failed to insert seat batch at index ${i}: ${seatInsertErr.message}`);
      }
    }
    console.log(`Successfully bulk-seeded ${seatData.length} seats.`);

    console.log("RailVista Database Seed Operation Completed Successfully! 🎉");
  } catch (err: any) {
    console.error("Database seed failed with error:", err.message || err);
    process.exit(1);
  }
}

runSeeder();
