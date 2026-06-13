"use client";

import React from "react";
import { Train } from "@/data/trains";
import { Loader2 } from "lucide-react";

interface BookingSummaryProps {
  train: Train;
  classCode: string;
  selectedSeats: string[];
  passengerCount: number;
  convenienceFee?: number;
  taxRate?: number; // decimal e.g. 0.05 for 5%
  onSubmit?: () => void;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

export default function BookingSummary({
  train,
  classCode,
  selectedSeats,
  passengerCount,
  convenienceFee = 50,
  taxRate = 0.05,
  onSubmit,
  submitButtonText = "Proceed to Payment",
  isSubmitting = false,
}: BookingSummaryProps) {
  const activeClass = train.classes.find((c) => c.code === classCode) || train.classes[0];
  const basePricePerTicket = activeClass ? activeClass.price : 1900;

  const subtotal = basePricePerTicket * passengerCount;
  const taxes = Math.round(subtotal * taxRate);
  const totalAmount = subtotal > 0 ? subtotal + convenienceFee + taxes : 0;

  return (
    <aside className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,51,153,0.04)] border border-outline-variant/30 overflow-hidden sticky top-28 select-none">
      {/* Header */}
      <div className="bg-primary text-on-primary p-6">
        <h3 className="font-title-md text-title-md font-bold mb-2">Journey Summary</h3>
        <p className="text-sm opacity-90">{train.name} (#{train.number})</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Route Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-outline uppercase tracking-wider font-semibold text-xs">Route</span>
            <span className="font-bold text-primary">
              {train.fromStationCode} → {train.toStationCode}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-outline uppercase tracking-wider font-semibold text-xs">Class & Quota</span>
            <span className="font-bold text-on-surface">
              {classCode} | General
            </span>
          </div>
          {selectedSeats.length > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-outline uppercase tracking-wider font-semibold text-xs">Selected Seats</span>
              <span className="font-bold text-secondary">
                {selectedSeats.join(", ")} ({selectedSeats.length})
              </span>
            </div>
          )}
        </div>

        <div className="h-px bg-outline-variant/50"></div>

        {/* Fare Details */}
        <div className="space-y-3">
          <h4 className="font-label-md text-label-md text-outline uppercase tracking-wider font-bold mb-2">
            Fare Details
          </h4>
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>Base Fare ({passengerCount} x ₹{basePricePerTicket.toLocaleString("en-IN")})</span>
            <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>Convenience Fee</span>
            <span className="font-medium">₹{convenienceFee.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>Taxes & GST (5%)</span>
            <span className="font-medium">₹{taxes.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="h-px bg-outline-variant/50"></div>

        {/* Total Price */}
        <div className="flex justify-between items-center">
          <span className="font-title-md text-title-md text-primary font-bold">Total Amount</span>
          <span className="text-[24px] font-bold text-secondary">
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Submit Button */}
        {onSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={passengerCount === 0 || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-2 ${
              passengerCount === 0 || isSubmitting
                ? "bg-surface-container text-outline cursor-not-allowed"
                : "bg-secondary text-on-secondary hover:bg-primary hover:shadow-lg scale-98 active:scale-95 duration-200 cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              submitButtonText
            )}
          </button>
        )}
      </div>
    </aside>
  );
}
