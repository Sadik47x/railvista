import "./env-loader";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function runRlsTest() {
  console.log("================ SUPABASE AUTH & RLS SECURITY TEST ================");

  const emailA = "usera@railvista.com";
  const emailB = "userb@railvista.com";
  const testPassword = "Password123!";

  try {
    // 1. Clean up existing test users if they exist to keep seed isolated
    console.log("\n1. Cleaning up previous test users...");
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersList && usersList.users) {
      for (const u of usersList.users) {
        if (u.email === emailA || u.email === emailB) {
          await supabaseAdmin.auth.admin.deleteUser(u.id);
          console.log(`   - Deleted previous test user: ${u.email}`);
        }
      }
    }

    // 2. Create User A and User B
    console.log("\n2. Creating test users User A and User B...");
    const { data: dataA, error: errA } = await supabaseAdmin.auth.admin.createUser({
      email: emailA,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: "User A" }
    });
    if (errA || !dataA.user) throw new Error(`Failed to create User A: ${errA?.message}`);
    const idA = dataA.user.id;
    console.log(`   - [SUCCESS] Created User A (ID: ${idA})`);

    const { data: dataB, error: errB } = await supabaseAdmin.auth.admin.createUser({
      email: emailB,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: "User B" }
    });
    if (errB || !dataB.user) throw new Error(`Failed to create User B: ${errB?.message}`);
    const idB = dataB.user.id;
    console.log(`   - [SUCCESS] Created User B (ID: ${idB})`);

    // 3. Setup client instances for User A and User B
    const clientA = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const clientB = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    // Sign in to establish authentic JWT sessions
    const { error: loginErrA } = await clientA.auth.signInWithPassword({ email: emailA, password: testPassword });
    if (loginErrA) throw new Error(`User A login failed: ${loginErrA.message}`);

    const { error: loginErrB } = await clientB.auth.signInWithPassword({ email: emailB, password: testPassword });
    if (loginErrB) throw new Error(`User B login failed: ${loginErrB.message}`);

    // 4. Create a booking linked to User A
    console.log("\n3. Creating booking linked to User A...");
    // Find a valid train and coach to make booking
    const { data: trains } = await supabaseAdmin.from("trains").select("id, train_number").limit(1);
    if (!trains || trains.length === 0) throw new Error("No trains found in DB to perform test.");
    const train = trains[0];

    const { data: coaches } = await supabaseAdmin.from("coaches").select("id, coach_name").eq("train_id", train.id).limit(1);
    if (!coaches || coaches.length === 0) throw new Error("No coaches found for test train.");
    const coach = coaches[0];

    const { data: seats } = await supabaseAdmin.from("seats").select("seat_number").eq("coach_id", coach.id).limit(1);
    if (!seats || seats.length === 0) throw new Error("No seats found in coach.");
    const seatNum = seats[0].seat_number;

    const journeyDate = "2026-08-10";

    // Clean up any old seat reservations for this seat/date
    await supabaseAdmin.from("seat_reservations").delete().eq("journey_date", journeyDate);

    // Call stored procedure passing User A's ID as p_user_id
    const { data: rpcResult, error: rpcErr } = await supabaseAdmin.rpc("create_booking_transaction", {
      p_train_id: train.id,
      p_coach_id: coach.id,
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

    // 5. Query as User A (Should find the booking)
    console.log("\n4. Verifying User A can view their own booking...");
    const { data: bookingsA, error: fetchErrA } = await clientA
      .from("bookings")
      .select("id, pnr, user_id");
    
    if (fetchErrA) throw new Error(`User A failed to fetch: ${fetchErrA.message}`);
    
    const foundA = bookingsA.find(b => b.id === bookingId);
    if (foundA) {
      console.log(`   - [SUCCESS] User A successfully retrieved booking! PNR: ${foundA.pnr}`);
    } else {
      console.error("   - [FAIL] User A could not find their own booking!");
    }

    // 6. Query as User B (Should NOT find the booking due to RLS)
    console.log("\n5. Verifying User B cannot view User A's booking (RLS Select)...");
    const { data: bookingsB, error: fetchErrB } = await clientB
      .from("bookings")
      .select("id, pnr, user_id");

    if (fetchErrB) throw new Error(`User B failed to fetch: ${fetchErrB.message}`);

    const foundB = bookingsB.find(b => b.id === bookingId);
    if (foundB) {
      console.error("   - [FAIL] RLS BREACH! User B successfully viewed User A's booking!");
    } else {
      console.log(`   - [SUCCESS] User B returned ${bookingsB.length} bookings. RLS successfully blocked access!`);
    }

    // 7. Try to cancel User A's booking using User B's client (Should fail)
    console.log("\n6. Verifying User B cannot cancel User A's booking (RLS Update/Function Security)...");
    const { error: cancelErrB } = await clientB.rpc("cancel_booking_transaction", {
      p_booking_id: bookingId
    });

    if (cancelErrB) {
      console.log(`   - [SUCCESS] User B was blocked from cancelling User A's booking: ${cancelErrB.message}`);
    } else {
      console.error("   - [FAIL] RLS BREACH! User B successfully cancelled User A's booking!");
    }

    // 8. User A cancels their own booking (Should succeed)
    console.log("\n7. Verifying User A can cancel their own booking...");
    const { error: cancelErrA } = await clientA.rpc("cancel_booking_transaction", {
      p_booking_id: bookingId
    });

    if (cancelErrA) {
      console.error(`   - [FAIL] User A failed to cancel their own booking: ${cancelErrA.message}`);
    } else {
      console.log("   - [SUCCESS] User A successfully cancelled their own booking!");
    }

    // 9. Clean up test users
    console.log("\n8. Cleaning up test users from DB...");
    await supabaseAdmin.auth.admin.deleteUser(idA);
    await supabaseAdmin.auth.admin.deleteUser(idB);
    console.log("   - Clean-up finished.");

  } catch (err: any) {
    console.error("\n[ERROR] RLS test failed:", err.message || err);
  }

  console.log("\n===================================================================");
}

runRlsTest();
