import { createClient } from "@supabase/supabase-js";
import "./env-loader";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase credentials not found in env.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testRpc() {
  console.log("Testing get_train_class_summaries...");
  try {
    const trainId = "9766da1b-8533-47e0-b6ab-db23d9178bf1"; // HWH Rajdhani
    
    console.log("1. Testing with YYYY-MM-DD (2026-07-15):");
    const { data: d1, error: e1 } = await supabaseAdmin.rpc("get_train_class_summaries", {
      p_train_ids: [trainId],
      p_journey_date: "2026-07-15" as any,
    });
    if (e1) console.error("Error 1:", e1.message);
    else console.log("Success 1:", d1);

    console.log("2. Testing with human format (15 July 2026):");
    const { data: d2, error: e2 } = await supabaseAdmin.rpc("get_train_class_summaries", {
      p_train_ids: [trainId],
      p_journey_date: "15 July 2026" as any,
    });
    if (e2) console.error("Error 2:", e2.message);
    else console.log("Success 2:", d2);
  } catch (err: any) {
    console.error("Exception:", err.message || err);
  }
}

testRpc();
