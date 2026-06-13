import { createClient } from "@supabase/supabase-js";
import "./env-loader";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase credentials not found in env.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function verifyCounts() {
  console.log("--- Database Verification: Checking Row Counts ---");
  try {
    const tables = ["stations", "trains", "train_stations", "coaches", "seats", "bookings", "seat_reservations", "passengers"];
    for (const table of tables) {
      const { count, error } = await supabaseAdmin
        .from(table)
        .select("*", { count: "exact", head: true });
      if (error) {
        console.error(`Error counting rows in ${table}:`, error.message);
      } else {
        console.log(`Table: ${table.padEnd(20)} | Rows: ${count}`);
      }
    }
  } catch (err: any) {
    console.error("Verification failed:", err.message || err);
  }
}

verifyCounts();
