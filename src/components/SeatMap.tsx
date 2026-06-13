"use client";

import React from "react";
import { Seat } from "@/data/seats";
import { ArrowLeft } from "lucide-react";

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: string[];
  onToggleSeat: (seatId: string) => void;
}

export function SeatLegend() {
  return (
    <div className="flex flex-wrap items-center gap-6 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 justify-center select-none">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white border border-outline-variant flex items-center justify-center text-xs font-bold text-on-surface">
          L
        </div>
        <span className="text-sm font-label-md text-on-surface-variant">Lower Berth</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white border border-outline-variant flex items-center justify-center text-xs font-bold text-on-surface">
          M
        </div>
        <span className="text-sm font-label-md text-on-surface-variant">Middle Berth</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white border border-outline-variant flex items-center justify-center text-xs font-bold text-on-surface">
          U
        </div>
        <span className="text-sm font-label-md text-on-surface-variant">Upper Berth</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white border border-outline-variant flex items-center justify-center text-xs font-bold text-on-surface">
          SL
        </div>
        <span className="text-sm font-label-md text-on-surface-variant">Side Lower</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white border border-outline-variant flex items-center justify-center text-xs font-bold text-on-surface">
          SU
        </div>
        <span className="text-sm font-label-md text-on-surface-variant">Side Upper</span>
      </div>
    </div>
  );
}

export default function SeatMap({ seats, selectedSeats, onToggleSeat }: SeatMapProps) {
  // Group row indexes
  const totalRows = Math.max(...seats.map((s) => s.row)) + 1;
  const rows = Array.from({ length: totalRows }, (_, i) => i);

  return (
    <div className="space-y-6">
      {/* Scrollable Train Container */}
      <div className="w-full bg-white p-6 rounded-[24px] border border-border-light shadow-sm overflow-x-auto">
        <div className="min-w-[480px] max-w-lg mx-auto border-4 border-double border-outline-variant/60 rounded-3xl p-6 relative bg-surface-muted/40">
          
          {/* Engine Direction Indicator */}
          <div className="flex justify-between items-center mb-6 px-4 py-2 bg-primary/10 text-primary rounded-lg select-none">
            <span className="font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-2 font-bold">
              <ArrowLeft className="w-4 h-4" /> Engine Direction
            </span>
            <span className="font-label-sm text-label-sm font-bold">COACH CENTER Aisle</span>
          </div>

          {/* Seat Grid Layout */}
          <div
            className="seat-grid relative"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr) 40px repeat(1, 1fr)",
              gap: "12px",
            }}
          >
            {/* Render Aisle Row Numbers */}
            {rows.map((r) => (
              <div
                key={`aisle-${r}`}
                className="col-start-4 flex items-center justify-center text-xs font-bold text-outline-variant/80 select-none"
                style={{
                  gridRowStart: r + 1,
                  height: "52px",
                }}
              >
                {Math.floor(r / 2) + 1}
              </div>
            ))}

            {/* Render Seats */}
            {seats.map((seat) => {
              const isSelected = selectedSeats.includes(seat.id);
              const isAvailable = seat.isAvailable;
              const gridCol = seat.column === 5 ? 5 : seat.column;

              return (
                <button
                  key={seat.id}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onToggleSeat(seat.id)}
                  style={{
                    gridColumnStart: gridCol,
                    gridRowStart: seat.row + 1,
                    height: "52px",
                  }}
                  className={`w-full rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                    !isAvailable
                      ? "bg-surface-container-high text-outline-variant cursor-not-allowed border border-transparent"
                      : isSelected
                      ? "bg-primary text-white border border-transparent shadow-md font-bold scale-[1.02]"
                      : "bg-white border-2 border-outline-variant/65 hover:border-secondary text-on-surface"
                  }`}
                >
                  <span className="text-sm font-bold leading-none">{seat.number}</span>
                  <span
                    className={`text-[9px] font-semibold mt-0.5 uppercase tracking-wide ${
                      isSelected ? "text-white/80" : "text-outline"
                    }`}
                  >
                    {seat.berthCode}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <SeatLegend />
    </div>
  );
}
