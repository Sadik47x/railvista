import { createClient } from "@supabase/supabase-js";
import "./env-loader";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function listUsers() {
  console.log("--- Supabase Auth Users Audit ---");
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error("Failed to list users:", error.message);
      return;
    }
    console.log(`Found ${users.length} users in database:\n`);
    users.forEach((u, i) => {
      console.log(`[User ${i + 1}]`);
      console.log(`- ID: ${u.id}`);
      console.log(`- Email: ${u.email}`);
      console.log(`- Confirmed: ${u.email_confirmed_at ? "Yes" : "No"}`);
      console.log(`- Metadata:`, JSON.stringify(u.user_metadata));
      console.log(`-----------------------------------`);
    });
  } catch (err: any) {
    console.error("Error audit failed:", err.message || err);
  }
}

listUsers();
