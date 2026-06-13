"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import JourneyProgress from "@/components/JourneyProgress";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { recentBooking } = useBooking();

  const booking = recentBooking;

  useEffect(() => {
    if (!booking) {
      const timer = setTimeout(() => {
        router.push("/my-bookings");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [booking, router]);

  if (!booking) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-24 text-center space-y-4">
        <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
          Retrieving Booking Status...
        </h1>
        <p className="text-on-surface-variant text-sm">
          Redirecting you to dashboard shortly or click below.
        </p>
        <Link
          href="/my-bookings"
          className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full font-bold"
        >
          View Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-gutter py-8">
      {/* progress tracking funnel */}
      <JourneyProgress currentStep="confirmation" />

      {/* Confirmation Card */}
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-outline-variant/30 shadow-[0px_10px_30px_rgba(0,51,153,0.06)] overflow-hidden text-center p-8 md:p-12 space-y-8 select-none">
        
        {/* Animated Checkmark Wrapper */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-tertiary-container/30 text-on-tertiary-container rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle2 className="w-14 h-14 text-on-tertiary-container" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight font-bold">
            Booking Confirmed!
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
            Your seats have been successfully reserved. A digital boarding pass has been generated.
          </p>
        </div>

        {/* Dynamic Booking Summary Card */}
        <div className="bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/30 text-left space-y-4">
          <div className="flex justify-between items-center text-sm border-b border-outline-variant/20 pb-3">
            <span className="text-outline uppercase font-semibold tracking-wider text-xs">PNR Number</span>
            <span className="font-mono font-bold text-primary text-base">{booking.pnr}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-outline-variant/20 pb-3">
            <span className="text-outline uppercase font-semibold tracking-wider text-xs">Train details</span>
            <span className="font-bold text-on-surface">{booking.trainName} (#{booking.trainNumber})</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-outline-variant/20 pb-3">
            <span className="text-outline uppercase font-semibold tracking-wider text-xs">Class & Seats</span>
            <span className="font-bold text-secondary">
              {booking.classCode} | {booking.coachId}-{booking.seats.join(`, ${booking.coachId}-`)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-outline uppercase font-semibold tracking-wider text-xs">Travel Date</span>
            <span className="font-bold text-on-surface">{booking.date}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            href={`/ticket/${booking.id}`}
            className="flex-1 bg-primary text-on-primary py-3.5 rounded-xl font-bold shadow-md hover:bg-primary-container text-center transition-all scale-98 active:scale-95 duration-200"
          >
            View Digital Ticket
          </Link>
          <Link
            href="/my-bookings"
            className="flex-1 border-2 border-secondary text-secondary py-3.5 rounded-xl font-bold hover:bg-secondary/5 text-center transition-all scale-98 active:scale-95 duration-200"
          >
            Trip Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
