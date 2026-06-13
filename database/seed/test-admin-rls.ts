import "./env-loader";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function runAdminRlsTest() {
  console.log("================ SUPABASE ADMIN RLS BYPASS TEST ================");

  const emailAdmin = "admin_test@railvista.com";
  const emailA = "usera_test@railvista.com";
  const testPassword = "Password123!";

  try {
    // 1. Clean up existing test users
    console.log("\n1. Cleaning up previous test users...");
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersList && usersList.users) {
      for (const u of usersList.users) {
        if (u.email === emailAdmin || u.email === emailA) {
          await supabaseAdmin.auth.admin.deleteUser(u.id);
          console.log(`   - Deleted previous test user: ${u.email}`);
        }
      }
    }

    // 2. Create Admin User (with role = 'admin' metadata) and User A
    console.log("\n2. Creating Admin user and User A...");
    const { data: dataAdmin, error: errAdmin } = await supabaseAdmin.auth.admin.createUser({
      email: emailAdmin,
      password: testPassword,
      email_confirm: true,
      user_metadata: { role: "admin", full_name: "Admin User" }
    });
    if (errAdmin || !dataAdmin.user) throw new Error(`Failed to create Admin: ${errAdmin?.message}`);
    const idAdmin = dataAdmin.user.id;
    console.log(`   - [SUCCESS] Created Admin User (ID: ${idAdmin})`);

    const { data: dataA, error: errA } = await supabaseAdmin.auth.admin.createUser({
      email: emailA,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: "User A" }
    });
    if (errA || !dataA.user) throw new Error(`Failed to create User A: ${errA?.message}`);
    const idA = dataA.user.id;
    console.log(`   - [SUCCESS] Created User A (ID: ${idA})`);

    // 3. Setup client instances and log in
    const clientAdmin = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const clientA = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { error: loginErrAdmin } = await clientAdmin.auth.signInWithPassword({ email: emailAdmin, password: testPassword });
    if (loginErrAdmin) throw new Error(`Admin login failed: ${loginErrAdmin.message}`);

    const { error: loginErrA } = await clientA.auth.signInWithPassword({ email: emailA, password: testPassword });
    if (loginErrA) throw new Error(`User A login failed: ${loginErrA.message}`);

    // 4. Create a booking linked to User A
    console.log("\n3. Creating booking linked to User A...");
    const { data: trains } = await supabaseAdmin.from("trains").select("id").limit(1);
    const trainId = trains![0].id;

    const { data: coaches } = await supabaseAdmin.from("coaches").select("id").eq("train_id", trainId).limit(1);
    const coachId = coaches![0].id;

    const { data: seats } = await supabaseAdmin.from("seats").select("seat_number").eq("coach_id", coachId).limit(1);
    const seatNum = seats![0].seat_number;

    const journeyDate = "2026-08-15";
    await supabaseAdmin.from("seat_reservations").delete().eq("journey_date", journeyDate);

    const { data: rpcResult, error: rpcErr } = await supabaseAdmin.rpc("create_booking_transaction", {
      p_train_id: trainId,
      p_coach_id: coachId,
      p_journey_date: journeyDate,
      p_total_fare: 1500,
      p_booking_date: "13 Jun 2026",
      p_passengers: [
        {
          full_name: "Passenger A",
          age: 30,
          gender: "Male",
          berth_preference: "Lower",
          seat_number: seatNum
        }
      ],
      p_user_id: idA
    });

    if (rpcErr || !rpcResult || rpcResult.length === 0) {
      throw new Error(`Failed to create test booking: ${rpcErr?.message}`);
    }

    const bookingId = rpcResult[0].booking_id;
    const pnr = rpcResult[0].pnr;
    console.log(`   - [SUCCESS] Booking Created! PNR: ${pnr}, Booking ID: ${bookingId}`);

    // 5. Query as Admin User (Should see User A's booking)
    console.log("\n4. Verifying Admin User can view User A's booking (Admin SELECT Policy)...");
    const { data: adminBookings, error: fetchErrAdmin } = await clientAdmin
      .from("bookings")
      .select("id, pnr, user_id");

    if (fetchErrAdmin) throw new Error(`Admin failed to fetch: ${fetchErrAdmin.message}`);

    const foundByAdmin = adminBookings.find(b => b.id === bookingId);
    if (foundByAdmin) {
      console.log(`   - [SUCCESS] Admin successfully bypassed RLS to view User A's booking! PNR: ${foundByAdmin.pnr}`);
    } else {
      console.error("   - [FAIL] Admin failed to view User A's booking. RLS blocked access!");
    }

    // 6. Cancel User A's booking as Admin (Should succeed)
    console.log("\n5. Verifying Admin User can cancel User A's booking (Admin UPDATE Policy)...");
    const { error: cancelErrAdmin } = await clientAdmin.rpc("cancel_booking_transaction", {
      p_booking_id: bookingId
    });

    if (cancelErrAdmin) {
      console.error(`   - [FAIL] Admin failed to cancel User A's booking: ${cancelErrAdmin.message}`);
    } else {
      console.log("   - [SUCCESS] Admin successfully cancelled User A's booking!");
    }

    // 7. Clean up test users
    console.log("\n6. Cleaning up test users from DB...");
    await supabaseAdmin.auth.admin.deleteUser(idAdmin);
    await supabaseAdmin.auth.admin.deleteUser(idA);
    console.log("   - Clean-up finished.");

  } catch (err: any) {
    console.error("\n[ERROR] Admin RLS test failed:", err.message || err);
  }

  console.log("\n================================================================");
}

runAdminRlsTest();
