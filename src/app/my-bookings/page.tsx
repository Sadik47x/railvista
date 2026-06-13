"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { ArrowRight, Frown, Calendar, Ticket, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function MyBookingsPage() {
  const { bookings, cancelBooking } = useBooking();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  // Sync with context changes
  const [localBookings, setLocalBookings] = useState(bookings);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  if (loading || !user) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-24 text-center space-y-4 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h1 className="font-title-md text-title-md text-primary font-bold">
          Verifying Session...
        </h1>
      </div>
    );
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      await cancelBooking(bookingId);
    }
  };

  const upcomingTrips = localBookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "CANCELLED"
  );
  const pastTrips = localBookings.filter((b) => b.status === "COMPLETED");

  const activeTrips = activeTab === "upcoming" ? upcomingTrips : pastTrips;

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12 space-y-10 min-h-screen select-none">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="font-display-lg text-display-lg text-primary font-bold">
            My Bookings Dashboard
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage your active trips, print boarding passes, and review travel history.
          </p>
        </div>
        <Link
          href="/"
          className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-md hover:bg-primary-container transition-all scale-98 active:scale-95 duration-200"
        >
          Book New Ticket
        </Link>
      </section>

      {/* Tabs */}
      <div className="border-b border-outline-variant/30 flex gap-8">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-4 font-title-md text-title-md transition-all cursor-pointer ${
            activeTab === "upcoming"
              ? "text-secondary font-bold border-b-2 border-secondary"
              : "text-on-surface-variant hover:text-secondary"
          }`}
        >
          Upcoming Trips ({upcomingTrips.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`pb-4 font-title-md text-title-md transition-all cursor-pointer ${
            activeTab === "past"
              ? "text-secondary font-bold border-b-2 border-secondary"
              : "text-on-surface-variant hover:text-secondary"
          }`}
        >
          Past Journeys ({pastTrips.length})
        </button>
      </div>

      {/* Trips list */}
      <div className="space-y-6">
        {activeTrips.length > 0 ? (
          activeTrips.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden hover:border-secondary/20 transition-all duration-300"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Train details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {booking.classCode} class
                    </span>
                    <span className="text-outline font-mono text-xs">PNR: {booking.pnr}</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-primary font-bold">
                    {booking.trainName} (#{booking.trainNumber})
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                    <span className="font-bold text-on-surface">{booking.fromStationCode}</span>
                    <ArrowRight className="w-4 h-4 text-outline" />
                    <span className="font-bold text-on-surface">{booking.toStationCode}</span>
                    <span className="mx-2">|</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      {booking.date}
                    </span>
                  </div>
                </div>

                {/* Timing and details */}
                <div className="flex items-center gap-6 text-sm text-on-surface-variant">
                  <div className="text-center md:text-left">
                    <p className="text-xs text-outline font-semibold">DEPARTS</p>
                    <p className="font-bold text-primary text-base">{booking.departureTime}</p>
                    <p className="text-xs text-on-surface-variant">{booking.fromStationName}</p>
                  </div>
                  <div className="w-8 h-px bg-outline-variant"></div>
                  <div className="text-center md:text-right">
                    <p className="text-xs text-outline font-semibold">ARRIVES</p>
                    <p className="font-bold text-primary text-base">{booking.arrivalTime}</p>
                    <p className="text-xs text-on-surface-variant">{booking.toStationName}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 items-stretch w-full md:w-auto">
                  {booking.status === "CONFIRMED" ? (
                    <>
                      <Link
                        href={`/ticket/${booking.id}`}
                        className="bg-secondary text-on-secondary px-6 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-primary text-center transition-all scale-98 active:scale-95 duration-200"
                      >
                        Boarding Pass
                      </Link>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="border border-error/50 text-error hover:bg-error/5 px-6 py-2.5 rounded-xl text-sm font-bold text-center transition-all cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    </>
                  ) : booking.status === "CANCELLED" ? (
                    <span className="bg-error/10 text-error px-6 py-2.5 rounded-xl text-sm font-bold text-center border border-error/20">
                      Cancelled
                    </span>
                  ) : (
                    <Link
                      href={`/ticket/${booking.id}`}
                      className="border border-secondary text-secondary hover:bg-secondary/5 px-6 py-2.5 rounded-xl text-sm font-bold text-center transition-all"
                    >
                      View Ticket Details
                    </Link>
                  )}
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <Ticket className="w-16 h-16 text-outline-variant mx-auto" />
            <p className="text-lg font-bold text-primary">No trips found</p>
            <p className="text-on-surface-variant text-sm max-w-sm mx-auto">
              You don't have any {activeTab} trips scheduled. Book a new ticket to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
