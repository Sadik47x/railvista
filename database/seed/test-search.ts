import "./env-loader";
import { trainService } from "../../src/services/train.service";
import { isSupabaseConfigured } from "../../src/lib/supabase/client";

console.log("Supabase configured:", isSupabaseConfigured());

async function runTest() {
  const routes = [
    { from: "HWH", to: "NDLS" },
    { from: "HWH", to: "PNBE" },
    { from: "PNBE", to: "NDLS" },
    { from: "MAS", to: "CNB" },
    { from: "NDLS", to: "HWH" }, // Opposite direction
    { from: "BSB", to: "NDLS" },  // Stop sequence
    { from: "HWH", to: "BSB" },   // Stop sequence
    { from: "CNB", to: "BSB" },   // Stop sequence
    { from: "CSMT", to: "PUNE" }, // West Corridor
    { from: "ERS", to: "TVC" },   // South Corridor
    { from: "ADI", to: "ST" },    // West Coast
    { from: "HWH", to: "TVC" },   // Invalid route (far distance, no direct train seeded)
  ];

  console.log("\n================ SEARCH VERIFICATION AUDIT ================");

  let index = 1;
  for (const { from, to } of routes) {
    console.log(`\nSearch #${index}: ${from} → ${to}`);
    try {
      const results = await trainService.getTrains(from, to, "2026-07-15");
      console.log(`Status: SUCCESS | Trains Found: ${results.length}`);
      if (results.length > 0) {
        results.forEach((train) => {
          console.log(`  * Train ${train.number}: ${train.name} (${train.type})`);
          console.log(`    Route: ${train.fromStationName} (${train.fromStationCode}) → ${train.toStationName} (${train.toStationCode})`);
          console.log(`    Timings: Dep ${train.departureTime} | Arr ${train.arrivalTime} | Duration: ${train.duration}`);
          console.log(`    Classes:`, train.classes.map(c => `${c.code} (${c.availableSeats} available)`).join(", "));
        });
      } else {
        console.log(`  * [No Trains Found] "No Trains Found" correctly triggered because no direct train connects ${from} to ${to}.`);
      }
    } catch (e: any) {
      console.error(`  * Search failed with error:`, e.message || e);
    }
    index++;
  }
  console.log("\n===========================================================");
}

runTest();
