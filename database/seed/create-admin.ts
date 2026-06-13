import { createClient } from "@supabase/supabase-js";
import "./env-loader";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function createAdmin() {
  console.log("--- Creating Admin User Account in Supabase Auth ---");
  const adminEmail = "admin@railvista.com";
  const adminPassword = "AdminPassword123!";

  try {
    // 1. Delete if already exists to prevent conflict
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
    if (usersList && usersList.users) {
      for (const u of usersList.users) {
        if (u.email === adminEmail) {
          console.log(`   - Found existing user ${adminEmail}. Deleting to recreate...`);
          await supabaseAdmin.auth.admin.deleteUser(u.id);
        }
      }
    }

    // 2. Create the admin user with custom role metadata
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { role: "admin", full_name: "RailVista Admin" }
    });

    if (error || !data.user) {
      console.error("Failed to create admin account:", error?.message);
    } else {
      console.log("\n==========================================");
      console.log("[SUCCESS] Admin Account Created Successfully!");
      console.log(`- Email:    ${data.user.email}`);
      console.log(`- Password: ${adminPassword}`);
      console.log(`- User ID:  ${data.user.id}`);
      console.log(`- Metadata: role: "admin", full_name: "RailVista Admin"`);
      console.log("==========================================\n");
    }
  } catch (err: any) {
    console.error("Error creating admin account:", err.message || err);
  }
}

createAdmin();
