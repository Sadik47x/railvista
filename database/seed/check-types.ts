import { createClient } from "@supabase/supabase-js";
import "./env-loader";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase credentials not found in env.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkTypes() {
  console.log("Checking database column types...");
  try {
    // We can query database types using supabase client selecting from pg_catalog or information_schema.
    // Wait, the REST API doesn't expose information_schema by default, unless we query it or have an RPC.
    // Let's check if we can query it, or if we get permission denied.
    const { data: cols, error } = await supabaseAdmin
      .from("seat_reservations")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Error querying seat_reservations:", error.message);
    } else {
      console.log("seat_reservations first row:", cols);
    }
  } catch (err: any) {
    console.error("Exception:", err.message || err);
  }
}

checkTypes();
