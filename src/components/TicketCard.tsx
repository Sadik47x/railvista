"use client";

import React from "react";
import { Booking } from "@/data/bookings";
import PNRBadge from "./PNRBadge";
import QRSection from "./QRSection";
import { Printer, Train } from "lucide-react";

interface TicketCardProps {
  booking: Booking;
  onPrint?: () => void;
}

export default function TicketCard({ booking, onPrint }: TicketCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Printable Ticket Container */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-[0px_8px_30px_rgba(0,51,153,0.06)] border border-outline-variant/30 relative select-none">
        
        {/* Ticket Header */}
        <div className="bg-primary text-on-primary p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider font-bold">
              Digital Boarding Pass
            </span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-white">
              {booking.trainName}
            </h2>
            <p className="text-sm opacity-80">Train #{booking.trainNumber} | Class: {booking.classCode}</p>
          </div>
          <div className="flex flex-col md:items-end gap-1">
            <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider">
              PNR NUMBER
            </span>
            <PNRBadge pnr={booking.pnr} />
          </div>
        </div>

        {/* Departure & Destination timings */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-outline font-semibold">DEPARTS</span>
            <h3 className="text-[24px] font-bold text-primary">{booking.departureTime}</h3>
            <p className="text-base font-bold text-on-surface">{booking.fromStationName} ({booking.fromStationCode})</p>
            <p className="text-xs text-outline">{booking.date}</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-outline font-medium mb-1">Direct Journey</span>
            <div className="w-full h-0.5 bg-outline-variant relative flex items-center justify-center">
              <Train className="w-5 h-5 text-secondary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1" />
            </div>
            <span className="text-xs text-secondary font-bold mt-2">Confirmed</span>
          </div>

          <div className="space-y-1 md:text-right">
            <span className="text-xs uppercase tracking-wider text-outline font-semibold">ARRIVES</span>
            <h3 className="text-[24px] font-bold text-primary">{booking.arrivalTime}</h3>
            <p className="text-base font-bold text-on-surface">{booking.toStationName} ({booking.toStationCode})</p>
            <p className="text-xs text-outline">{booking.date}</p>
          </div>
        </div>

        {/* Perforation Line */}
        <div className="relative h-6 flex items-center justify-between pointer-events-none">
          <div className="w-4 h-8 rounded-r-full bg-background -ml-2 border-r border-outline-variant/30"></div>
          <div className="flex-1 border-t-2 border-dashed border-outline-variant/60 mx-2"></div>
          <div className="w-4 h-8 rounded-l-full bg-background -mr-2 border-l border-outline-variant/30"></div>
        </div>

        {/* Passenger & Seat Details */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-surface-container-low/50 p-4 rounded-xl">
            <div>
              <p className="text-outline uppercase tracking-wider font-semibold text-xs mb-1">COACH</p>
              <p className="font-bold text-primary text-base">{booking.coachId}</p>
            </div>
            <div>
              <p className="text-outline uppercase tracking-wider font-semibold text-xs mb-1">SEATS</p>
              <p className="font-bold text-primary text-base">{booking.seats.join(", ")}</p>
            </div>
            <div>
              <p className="text-outline uppercase tracking-wider font-semibold text-xs mb-1">QUOTA</p>
              <p className="font-bold text-on-surface text-base">General</p>
            </div>
            <div>
              <p className="text-outline uppercase tracking-wider font-semibold text-xs mb-1">FARE PAID</p>
              <p className="font-bold text-secondary text-base">₹{booking.totalAmount.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div>
            <h4 className="font-label-md text-label-md text-primary font-bold mb-3">
              Passenger Information
            </h4>
            <div className="border border-outline-variant/40 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-bold border-b border-outline-variant/30">
                    <th className="p-3 font-semibold">#</th>
                    <th className="p-3 font-semibold">Name</th>
                    <th className="p-3 font-semibold">Age/Sex</th>
                    <th className="p-3 font-semibold">Seat</th>
                    <th className="p-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.passengers.map((p, idx) => (
                    <tr
                      key={p.name}
                      className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-container-low/20 transition-colors"
                    >
                      <td className="p-3 font-bold text-outline">{idx + 1}</td>
                      <td className="p-3 font-bold text-primary">{p.name}</td>
                      <td className="p-3 text-on-surface-variant">
                        {p.age} / {p.gender[0]}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-secondary">{booking.coachId}-{p.seatNumber}</span>{" "}
                        <span className="text-xs text-outline">({p.berthType})</span>
                      </td>
                      <td className="p-3 text-right font-bold text-tertiary-container">CNF</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-px bg-outline-variant/50"></div>

          {/* Barcode and QR Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-2">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-xs text-outline font-semibold uppercase tracking-wider">
                Authorized Boarding Document
              </p>
              {/* Barcode representation */}
              <div className="bg-on-surface h-12 w-64 flex flex-col justify-end items-center tracking-[4px] text-[10px] text-white font-mono rounded overflow-hidden select-none">
                <div
                  className="w-full h-8 bg-white flex"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #000 2px, transparent 2px, #000 6px, transparent 8px, #000 12px, #000 16px, transparent 18px)",
                    backgroundSize: "24px 100%",
                  }}
                ></div>
                <span className="opacity-90">{booking.id}</span>
              </div>
            </div>
            
            {/* QR Section */}
            <QRSection value={`PNR:${booking.pnr}|TRAIN:${booking.trainNumber}`} />
          </div>
        </div>
      </div>

      {/* Ticket Download / Print Options */}
      {onPrint && (
        <div className="flex justify-center gap-4">
          <button
            onClick={onPrint}
            className="flex items-center gap-2 bg-secondary text-on-secondary px-8 py-3 rounded-full font-bold shadow-md hover:bg-primary transition-all cursor-pointer scale-98 active:scale-95 duration-200"
          >
            <Printer className="w-5 h-5" /> Print Ticket
          </button>
        </div>
      )}
    </div>
  );
}
