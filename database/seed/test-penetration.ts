import "./env-loader";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function runPenetrationTest() {
  console.log("================= SECURITY PENETRATION TEST =================");
  
  const emailA = "usera_pentest@railvista.com";
  const emailB = "userb_pentest@railvista.com";
  const testPassword = "Password123!";

  try {
    // 1. Setup clean test environment
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
    if (usersList && usersList.users) {
      for (const u of usersList.users) {
        if (u.email === emailA || u.email === emailB) {
          await supabaseAdmin.auth.admin.deleteUser(u.id);
        }
      }
    }

    // 2. Create User A and User B
    const { data: dataA } = await supabaseAdmin.auth.admin.createUser({
      email: emailA,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: "User A" }
    });
    const { data: dataB } = await supabaseAdmin.auth.admin.createUser({
      email: emailB,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: "User B" }
    });

    const idA = dataA.user!.id;
    const idB = dataB.user!.id;

    // 3. Create client clients
    const clientA = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const clientB = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const clientGuest = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } });

    await clientA.auth.signInWithPassword({ email: emailA, password: testPassword });
    await clientB.auth.signInWithPassword({ email: emailB, password: testPassword });

    // 4. User A creates a booking
    const { data: trains } = await supabaseAdmin.from("trains").select("id").limit(1);
    const trainId = trains![0].id;
    const { data: coaches } = await supabaseAdmin.from("coaches").select("id").eq("train_id", trainId).limit(1);
    const coachId = coaches![0].id;
    const { data: seats } = await supabaseAdmin.from("seats").select("seat_number").eq("coach_id", coachId).limit(1);
    const seatNum = seats![0].seat_number;

    const journeyDate = "2026-09-01";
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
          age: 32,
          gender: "Male",
          berth_preference: "Lower",
          seat_number: seatNum
        }
      ],
      p_user_id: idA
    });

    if (rpcErr || !rpcResult) throw new Error("Failed to create test booking: " + rpcErr?.message);
    const bookingId = rpcResult[0].booking_id;
    const pnr = rpcResult[0].pnr;
    
    console.log(`[SETUP] Booking created for User A (PNR: ${pnr}, ID: ${bookingId})\n`);

    // ==========================================
    // TEST 1: User B tries to SELECT User A's booking
    // ==========================================
    console.log("TEST 1: User B attempts to read User A's booking record...");
    const { data: bSelectB, error: errSelB } = await clientB
      .from("bookings")
      .select("*")
      .eq("id", bookingId);

    if (errSelB) {
      console.log(`   - [PASS] Read blocked by database query rejection: ${errSelB.message}`);
    } else if (bSelectB && bSelectB.length === 0) {
      console.log(`   - [PASS] Read returned 0 records. RLS filtered out foreign booking.`);
    } else {
      console.error(`   - [FAIL] Security Leak! User B read User A's booking:`, bSelectB);
    }

    // ==========================================
    // TEST 2: User B tries to access User A's passengers
    // ==========================================
    console.log("\nTEST 2: User B attempts to access User A's passenger data...");
    const { data: passSelectB, error: errPassB } = await clientB
      .from("passengers")
      .select("*")
      .eq("booking_id", bookingId);

    if (errPassB) {
      console.log(`   - [PASS] Access blocked by database query rejection: ${errPassB.message}`);
    } else if (passSelectB && passSelectB.length === 0) {
      console.log(`   - [PASS] Access returned 0 records. RLS blocked passenger leak.`);
    } else {
      console.error(`   - [FAIL] Security Leak! User B read User A's passengers:`, passSelectB);
    }

    // ==========================================
    // TEST 3: User B tries to cancel User A's booking
    // ==========================================
    console.log("\nTEST 3: User B attempts to cancel User A's booking (RPC cancel_booking_transaction)...");
    const { error: cancelErrB } = await clientB.rpc("cancel_booking_transaction", {
      p_booking_id: bookingId
    });

    if (cancelErrB) {
      console.log(`   - [PASS] Cancellation rejected by RLS function context: ${cancelErrB.message}`);
    } else {
      console.error(`   - [FAIL] Security Leak! User B successfully cancelled User A's booking!`);
    }

    // ==========================================
    // TEST 4: Guest/Unauthenticated User attempts to read bookings
    // ==========================================
    console.log("\nTEST 4: Guest (unauthenticated) attempts to read bookings...");
    const { data: bGuest, error: errGuest } = await clientGuest
      .from("bookings")
      .select("*");

    if (errGuest) {
      console.log(`   - [PASS] Query blocked by database: ${errGuest.message}`);
    } else if (bGuest && bGuest.length === 0) {
      console.log(`   - [PASS] Query returned 0 bookings. RLS enforced for anonymous guests.`);
    } else {
      console.error(`   - [FAIL] Security Leak! Guest read bookings:`, bGuest);
    }

    // ==========================================
    // TEST 5: Direct URL manipulation simulation (checking single ID resolution)
    // ==========================================
    console.log("\nTEST 5: Direct URL manipulation lookup simulation (User B checks booking by ID)...");
    const { data: bLookupB } = await clientB
      .from("bookings")
      .select("id")
      .eq("id", bookingId)
      .maybeSingle();

    if (!bLookupB) {
      console.log(`   - [PASS] Lookup returned null. Direct ID manipulation cannot bypass RLS.`);
    } else {
      console.error(`   - [FAIL] Security Leak! Direct ID lookup bypassed RLS. ID: ${bLookupB.id}`);
    }

    // 5. Clean up test users
    console.log("\n[CLEANUP] Cleaning up pentest users...");
    await supabaseAdmin.auth.admin.deleteUser(idA);
    await supabaseAdmin.auth.admin.deleteUser(idB);
    console.log("   - Clean-up complete.");

  } catch (err: any) {
    console.error("\n[ERROR] Penetration test failed:", err.message || err);
  }

  console.log("\n=============================================================");
}

runPenetrationTest();
