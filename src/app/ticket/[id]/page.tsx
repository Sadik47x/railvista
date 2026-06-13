"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBooking } from "@/context/BookingContext";
import TicketCard from "@/components/TicketCard";
import { ArrowLeft, Ticket, Loader2 } from "lucide-react";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/data/bookings";

export default function TicketPage() {
  const params = useParams();
  const router = useRouter();
  const { bookings } = useBooking();

  const ticketId = params.id as string;
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 1. Try to find in context first
    const found = bookings.find((b) => b.id === ticketId || b.pnr === ticketId);
    if (found) {
      setBooking(found);
      setLoading(false);
    } else {
      // 2. If not found in context (e.g. on direct page load), fetch from service layer
      bookingService.getBookingById(ticketId).then((dbBooking) => {
        if (dbBooking) {
          setBooking(dbBooking);
          setLoading(false);
        } else {
          // Try PNR check as fallback
          bookingService.getBookingByPnr(ticketId).then((pnrBooking) => {
            setBooking(pnrBooking);
            setLoading(false);
          });
        }
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [ticketId, bookings]);

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-24 text-center space-y-4">
        <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
          Loading Ticket...
        </h1>
        <p className="text-on-surface-variant text-sm">
          Please wait while we retrieve your digital ticket.
        </p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-24 text-center space-y-6">
        <Ticket className="w-16 h-16 text-outline mx-auto" />
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
          Ticket Not Found
        </h1>
        <p className="text-on-surface-variant max-w-sm mx-auto text-sm">
          The booking ticket with ID <strong>#{ticketId}</strong> could not be found or has expired.
        </p>
        <Link
          href="/my-bookings"
          className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full font-bold"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12 space-y-8 print:py-0 print:px-0">
      {/* Back button (hidden on print) */}
      <button
        onClick={() => router.push("/my-bookings")}
        className="flex items-center gap-2 text-secondary font-label-md hover:underline font-bold print:hidden cursor-pointer"
      >
        <ArrowLeft className="w-4.5 h-4.5" />
        Back to Dashboard
      </button>

      {/* Printable Ticket Card */}
      <TicketCard booking={booking} onPrint={handlePrint} />
    </div>
  );
}
