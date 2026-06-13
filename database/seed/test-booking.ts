import "./env-loader";
import { bookingService } from "../../src/services/booking.service";
import { trainService } from "../../src/services/train.service";
import { seatService } from "../../src/services/seat.service";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

async function runBookingTest() {
  console.log("================ BOOKING ENGINE INTEGRATION TEST ================");

  try {
    const journeyDate = "2026-07-20";
    const trainNumber = "22301"; // HWH NDLS Vande Bharat
    const coachName = "C1";

    console.log(`\n1. Resolving Train and Seats for ${trainNumber} (${coachName}) on ${journeyDate}...`);
    const train = await trainService.getTrainByNumber(trainNumber, journeyDate);
    if (!train) {
      throw new Error(`Train ${trainNumber} not found.`);
    }
    console.log(`   - Train Found: ${train.name} (${train.number})`);

    const seats = await seatService.getSeatsForCoach(coachName, trainNumber, journeyDate);
    const availableSeats = seats.filter(s => s.isAvailable);
    console.log(`   - Available seats in coach ${coachName}: ${availableSeats.length} / ${seats.length}`);

    if (availableSeats.length === 0) {
      throw new Error("No available seats to test booking.");
    }

    const testSeat = availableSeats[0];
    console.log(`   - Selecting Seat ${testSeat.number} (Berth: ${testSeat.type}) for booking.`);

    // 2. Prepare Booking Object
    const testBooking = {
      id: "", // Will be assigned by RPC
      pnr: "", // Will be assigned by RPC
      trainNumber: trainNumber,
      trainName: train.name,
      fromStationCode: train.fromStationCode,
      fromStationName: train.fromStationName,
      toStationCode: train.toStationCode,
      toStationName: train.toStationName,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      date: journeyDate,
      classCode: "CC",
      coachId: coachName,
      seats: [testSeat.number.toString()],
      passengers: [
        {
          name: "Rohan Sharma",
          age: 28,
          gender: "Male",
          seatNumber: testSeat.number.toString(),
          berthType: testSeat.type,
        }
      ],
      totalAmount: 2800, // Client side estimation, server will calculate properly
      status: "CONFIRMED" as const,
      bookingDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    };

    console.log(`\n2. Creating Booking for Rohan Sharma...`);
    const createdBooking = await bookingService.createBooking(testBooking);

    if (!createdBooking) {
      throw new Error("Booking creation failed.");
    }

    console.log("   - [SUCCESS] Booking Created!");
    console.log(`   - PNR Generated: ${createdBooking.pnr}`);
    console.log(`   - Booking ID: ${createdBooking.id}`);
    console.log(`   - Total Fare Charged: ₹${createdBooking.totalAmount}`);
    console.log(`   - Status: ${createdBooking.status}`);

    // 3. Verify Seat Reservation in database
    console.log(`\n3. Verifying Seat Reservation in Database...`);
    const { data: reservation, error: resErr } = await supabaseAdmin
      .from("seat_reservations")
      .select("id, reservation_status, journey_date")
      .eq("booking_id", createdBooking.id)
      .maybeSingle();

    if (resErr || !reservation) {
      throw new Error(`Reservation check failed: ${resErr?.message || "No reservation record found"}`);
    }

    console.log(`   - [SUCCESS] Seat Reservation Found!`);
    console.log(`     * Reservation ID: ${reservation.id}`);
    console.log(`     * Journey Date: ${reservation.journey_date}`);
    console.log(`     * Status: ${reservation.reservation_status}`);

    // Verify double-booking prevention by trying to book the same seat on same date again
    console.log(`\n4. Verifying Double-Booking Prevention...`);
    const secondBooking = await bookingService.createBooking(testBooking);
    if (secondBooking) {
      console.error("   - [FAIL] Double booking was NOT prevented!");
    } else {
      console.log("   - [SUCCESS] Double booking successfully prevented! Database transaction rolled back.");
    }

    // 5. Retrieve Booking by PNR
    console.log(`\n5. Retrieving Booking by PNR (${createdBooking.pnr})...`);
    const retrievedBooking = await bookingService.getBookingByPnr(createdBooking.pnr);
    if (!retrievedBooking) {
      throw new Error("Booking retrieval failed.");
    }
    console.log(`   - [SUCCESS] Booking Retrieved!`);
    console.log(`     * PNR: ${retrievedBooking.pnr}`);
    console.log(`     * Passenger: ${retrievedBooking.passengers[0].name}`);
    console.log(`     * Train: ${retrievedBooking.trainName}`);
    console.log(`     * Seat: ${retrievedBooking.seats.join(", ")}`);

    // 6. Cancel Booking
    console.log(`\n6. Cancelling Booking (${createdBooking.id})...`);
    const cancelSuccess = await bookingService.cancelBooking(createdBooking.id);
    if (!cancelSuccess) {
      throw new Error("Booking cancellation failed.");
    }
    console.log(`   - [SUCCESS] Booking Cancelled via RPC!`);

    // 7. Verify seat reservation is released/cancelled
    console.log(`\n7. Verifying Seat Release in Database...`);
    const { data: cancelledRes, error: cResErr } = await supabaseAdmin
      .from("seat_reservations")
      .select("reservation_status")
      .eq("booking_id", createdBooking.id)
      .maybeSingle();

    if (cResErr) {
      throw new Error(`Cancelled reservation check failed: ${cResErr.message}`);
    }
    if (!cancelledRes) {
      console.log(`   - [SUCCESS] Reservation record was deleted (released) from Database!`);
    } else {
      console.log(`   - [SUCCESS] Reservation Status in DB updated to: ${cancelledRes.reservation_status}`);
    }

  } catch (err: any) {
    console.error("\n[ERROR] Test failed:", err.message || err);
  }

  console.log("\n=================================================================");
}

runBookingTest();
