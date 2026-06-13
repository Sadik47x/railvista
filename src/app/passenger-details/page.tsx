"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { Booking } from "@/data/bookings";
import JourneyProgress from "@/components/JourneyProgress";
import PassengerCard, { PassengerData } from "@/components/PassengerCard";
import BookingSummary from "@/components/BookingSummary";
import { Train, Calendar, ShoppingCart, Loader2 } from "lucide-react";

export default function PassengerDetailsPage() {
  const router = useRouter();
  const {
    selectedTrain,
    selectedClass,
    selectedSeats,
    setPassengers: setGlobalPassengers,
    addBooking,
    searchQuery,
  } = useBooking();

  const [passengersList, setPassengersList] = useState<PassengerData[]>([]);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize passengers list based on selected seats count
  useEffect(() => {
    if (selectedSeats.length > 0) {
      const initialList = selectedSeats.map((seatId) => ({
        name: "",
        age: "",
        gender: "",
        preference: "None",
        seatNumber: seatId,
      }));
      setPassengersList(initialList);
    } else {
      // Direct navigation fallback (prefill 1 passenger)
      setPassengersList([
        { name: "", age: "", gender: "", preference: "None", seatNumber: "22" },
      ]);
    }
  }, [selectedSeats]);

  const handlePassengerChange = (index: number, updatedData: PassengerData) => {
    const newList = [...passengersList];
    newList[index] = updatedData;
    setPassengersList(newList);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedTrain) return;

    setIsSubmitting(true);

    // Generate random PNR
    const pnrGroup1 = Math.floor(100 + Math.random() * 900);
    const pnrGroup2 = Math.floor(1000000 + Math.random() * 9000000);
    const pnrString = `${pnrGroup1}-${pnrGroup2}`;

    const baseFare = selectedTrain.classes.find((c) => c.code === selectedClass)?.price || 1900;
    const subtotal = baseFare * passengersList.length;
    const taxes = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + 50 + taxes;

    // Create booking object
    const newBooking: Booking = {
      id: pnrGroup2.toString(),
      pnr: pnrString,
      trainNumber: selectedTrain.number,
      trainName: selectedTrain.name,
      fromStationCode: selectedTrain.fromStationCode,
      fromStationName: selectedTrain.fromStationName,
      toStationCode: selectedTrain.toStationCode,
      toStationName: selectedTrain.toStationName,
      departureTime: selectedTrain.departureTime,
      arrivalTime: selectedTrain.arrivalTime,
      date: searchQuery.date, // Selected journey date from search query
      classCode: selectedClass,
      coachId: selectedClass === "2A" ? "A1" : selectedClass === "EC" ? "E1" : "B2",
      seats: selectedSeats.length > 0 ? selectedSeats : ["22"],
      passengers: passengersList.map((p) => ({
        name: p.name,
        age: parseInt(p.age) || 30,
        gender: p.gender || "Male",
        seatNumber: p.seatNumber || "22",
        berthType: p.preference || "Lower",
      })),
      totalAmount,
      status: "CONFIRMED",
      bookingDate: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    setGlobalPassengers(passengersList);
    
    try {
      await addBooking(newBooking);
    } catch (err) {
      console.error("Booking failed:", err);
    } finally {
      setIsSubmitting(false);
      router.push("/booking-confirmation");
    }
  };

  if (!selectedTrain) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-24 text-center space-y-6">
        <ShoppingCart className="w-16 h-16 text-outline mx-auto" />
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
          No Train Selected
        </h1>
        <p className="text-on-surface-variant max-w-sm mx-auto text-sm">
          Please select a train and berths before entering passenger details.
        </p>
        <button
          onClick={() => router.push("/")}
          className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full font-bold cursor-pointer"
        >
          Select Train
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-gutter py-8">
      {/* progress bar */}
      <JourneyProgress currentStep="passenger" />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Form Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Train Summary Header Card */}
          <div className="bg-primary p-6 rounded-xl text-white flex flex-col md:flex-row justify-between items-center custom-shadow select-none">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
                <Train className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="font-title-md text-title-md font-bold">
                  {selectedTrain.name} (#{selectedTrain.number})
                </h2>
                <p className="font-body-md text-white/80">
                  {selectedTrain.fromStationName} <span className="mx-2">→</span> {selectedTrain.toStationName}
                </p>
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-75">Date of Boarding</span>
              <p className="font-bold text-sm flex items-center gap-1.5 justify-center md:justify-end">
                <Calendar className="w-4 h-4 text-white/80" />
                {searchQuery.date}
              </p>
            </div>
          </div>

          {/* Passenger Cards */}
          <div className="space-y-6">
            {passengersList.map((passenger, index) => (
              <PassengerCard
                key={index}
                index={index + 1}
                passenger={passenger}
                onChange={(data) => handlePassengerChange(index, data)}
              />
            ))}
          </div>

          {/* Contact details */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-border-light shadow-sm space-y-6">
            <h3 className="font-title-md text-title-md text-primary font-bold pb-2 border-b border-outline-variant/35">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-label-sm text-label-sm text-on-surface-variant">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-body-md text-body-md transition-all rounded-t-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-label-sm text-label-sm text-on-surface-variant">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit number"
                  pattern="[0-9]{10}"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-body-md text-body-md transition-all rounded-t-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Panel */}
        <div className="lg:col-span-4">
          <BookingSummary
            train={selectedTrain}
            classCode={selectedClass}
            selectedSeats={selectedSeats}
            passengerCount={passengersList.length}
            submitButtonText="Make Payment (Mock)"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
