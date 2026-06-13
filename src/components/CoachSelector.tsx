"use client";

import React from "react";
import { Coach } from "@/data/coaches";

interface CoachSelectorProps {
  coaches: Coach[];
  selectedCoachId: string;
  onSelectCoach: (coachId: string) => void;
  availableSeatsCount?: number;
}

export default function CoachSelector({
  coaches,
  selectedCoachId,
  onSelectCoach,
  availableSeatsCount = 18,
}: CoachSelectorProps) {
  const activeCoach = coaches.find((c) => c.id === selectedCoachId) || coaches[0];

  return (
    <div className="space-y-6">
      {/* Selector Pills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-title-md text-title-md text-on-surface font-semibold">Select Coach</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white border border-outline-variant rounded-sm"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-surface-container-high rounded-sm"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-sm"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Selected</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-1 bg-surface-container rounded-xl overflow-x-auto no-scrollbar">
          {coaches.map((c) => {
            const isSelected = selectedCoachId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCoach(c.id)}
                className={`px-8 py-3 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white shadow-md font-bold"
                    : "text-on-surface-variant hover:bg-white/50"
                }`}
              >
                {c.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Coach Stats Card */}
      {activeCoach && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Coach Class
            </span>
            <span className="font-title-md text-title-md text-on-surface font-bold">
              {activeCoach.className}
            </span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Seats Available
            </span>
            <span className="font-title-md text-title-md text-secondary font-bold">
              {availableSeatsCount} / {activeCoach.totalSeats}
            </span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Base Fare
            </span>
            <span className="font-title-md text-title-md text-primary font-bold">
              ₹{activeCoach.classCode === "2A" ? "2,800" : activeCoach.classCode === "EC" ? "4,900" : "1,900"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
