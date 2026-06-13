"use client";

import React from "react";
import { Trash2 } from "lucide-react";

export interface PassengerData {
  name: string;
  age: string;
  gender: string;
  preference: string;
  seatNumber?: string;
}

interface PassengerCardProps {
  index: number;
  passenger: PassengerData;
  onChange: (data: PassengerData) => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export default function PassengerCard({
  index,
  passenger,
  onChange,
  onRemove,
  showRemoveButton = false,
}: PassengerCardProps) {
  const handleChange = (field: keyof PassengerData, value: string) => {
    onChange({
      ...passenger,
      [field]: value,
    });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-border-light shadow-sm space-y-6 relative transition-all hover:border-secondary/20">
      <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">
            {index}
          </span>
          <h3 className="font-title-md text-title-md text-primary font-bold">
            Passenger Details {passenger.seatNumber ? `(Seat ${passenger.seatNumber})` : ""}
          </h3>
        </div>
        {showRemoveButton && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-error hover:bg-error/5 p-2 rounded-lg flex items-center gap-1.5 font-label-sm transition-all cursor-pointer"
          >
            <Trash2 className="w-4.5 h-4.5" />
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2 space-y-2">
          <label className="block font-label-sm text-label-sm text-on-surface-variant">
            Full Name
          </label>
          <input
            type="text"
            required
            placeholder="As in Aadhaar / Passport"
            value={passenger.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-body-md text-body-md transition-all rounded-t-lg"
          />
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="block font-label-sm text-label-sm text-on-surface-variant">Age</label>
          <input
            type="number"
            required
            min="1"
            max="125"
            placeholder="Age"
            value={passenger.age}
            onChange={(e) => handleChange("age", e.target.value)}
            className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-body-md text-body-md transition-all rounded-t-lg"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="block font-label-sm text-label-sm text-on-surface-variant">Gender</label>
          <select
            value={passenger.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-3 py-3 font-label-md text-label-md rounded-t-lg"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Transgender">Transgender</option>
          </select>
        </div>
      </div>

      {/* Berth Preference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-2">
          <label className="block font-label-sm text-label-sm text-on-surface-variant">
            Berth Preference
          </label>
          <select
            value={passenger.preference}
            onChange={(e) => handleChange("preference", e.target.value)}
            className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-3 py-3 font-label-md text-label-md rounded-t-lg"
          >
            <option value="None">No Preference</option>
            <option value="Lower">Lower Berth</option>
            <option value="Middle">Middle Berth</option>
            <option value="Upper">Upper Berth</option>
            <option value="Side Lower">Side Lower</option>
            <option value="Side Upper">Side Upper</option>
          </select>
        </div>
      </div>
    </div>
  );
}
