"use client";

import React, { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Ticket, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Users, 
  TrendingUp, 
  Trash2,
  Loader2
} from "lucide-react";

export default function AdminBookingStatusPage() {
  const { bookings, cancelBooking } = useBooking();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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

  const total = bookings.length;
  const confirmed = bookings.filter(b => b.status === "CONFIRMED").length;
  const cancelled = bookings.filter(b => b.status === "CANCELLED").length;
  const pending = bookings.filter(b => b.status === "PENDING").length;

  const todayStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const todayCount = bookings.filter(b => b.bookingDate === todayStr).length;

  const handleCancel = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking in the database?")) {
      setIsProcessing(bookingId);
      try {
        const success = await cancelBooking(bookingId);
        if (success) {
          alert("Booking cancelled successfully.");
        } else {
          alert("Failed to cancel booking in the database.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while cancelling the booking.");
      } finally {
        setIsProcessing(null);
      }
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12 space-y-10 min-h-screen select-none">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="font-display-lg text-display-lg text-primary font-bold">
          Admin Booking Verification Dashboard
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Audit real-time railway bookings, verify Supabase table sync, and test atomic cancellations.
        </p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-outline uppercase">Total Bookings</span>
            <p className="text-3xl font-bold text-primary">{total}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-outline uppercase">Confirmed</span>
            <p className="text-3xl font-bold text-tertiary">{confirmed}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-tertiary-container/30 flex items-center justify-center text-on-tertiary-container">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-outline uppercase">Cancelled</span>
            <p className="text-3xl font-bold text-error">{cancelled}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-error-container/30 flex items-center justify-center text-on-error-container">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-outline uppercase">Pending</span>
            <p className="text-3xl font-bold text-outline">{pending}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-high/30 flex items-center justify-center text-outline">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-outline uppercase">Today's Bookings</span>
            <p className="text-3xl font-bold text-secondary">{todayCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Bookings List Table */}
      <section className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low">
          <h2 className="font-title-md text-title-md font-bold text-primary">Recent Database Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          {bookings.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant font-body-md">
              No booking records found in the database.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest text-xs font-semibold text-outline uppercase border-b border-outline-variant/30">
                  <th className="p-4">PNR</th>
                  <th className="p-4">Train & Coach</th>
                  <th className="p-4">Journey Date</th>
                  <th className="p-4">Passengers</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary">{b.pnr}</td>
                    <td className="p-4">
                      <div className="font-semibold text-on-surface">{b.trainName}</div>
                      <div className="text-xs text-on-surface-variant">
                        #{b.trainNumber} • {b.classCode} • {b.coachId} ({b.seats.join(", ")})
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-on-surface">
                        <Calendar className="w-4 h-4 text-outline" />
                        {b.date}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-on-surface">
                        <Users className="w-4 h-4 text-outline" />
                        {b.passengers.length}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-on-surface">₹{b.totalAmount}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        b.status === "CONFIRMED" 
                          ? "bg-tertiary-container/30 text-on-tertiary-container"
                          : b.status === "CANCELLED"
                          ? "bg-error-container/30 text-on-error-container"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}>
                        {b.status === "CONFIRMED" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {b.status === "CANCELLED" && <XCircle className="w-3.5 h-3.5" />}
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {b.status === "CONFIRMED" ? (
                        <button
                          disabled={isProcessing === b.id}
                          onClick={() => handleCancel(b.id)}
                          className="text-error hover:text-on-error-container font-semibold text-sm flex items-center gap-1 justify-end ml-auto disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          {isProcessing === b.id ? "Cancelling..." : "Cancel"}
                        </button>
                      ) : (
                        <span className="text-xs text-outline font-semibold">No Actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
