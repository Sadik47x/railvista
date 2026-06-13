"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Train, CoachClassInfo } from "@/data/trains";
import { CheckCircle2, AlertCircle, XCircle, Info, Map, Coffee, Wifi, Shield, Train as TrainIcon } from "lucide-react";

interface TrainCardProps {
  train: Train;
  defaultClassCode?: string;
  onViewRoute?: (trainId: string) => void;
}

export default function TrainCard({ train, defaultClassCode = "3A", onViewRoute }: TrainCardProps) {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    const hasDefault = train.classes.some((c) => c.code === defaultClassCode);
    return hasDefault ? defaultClassCode : train.classes[0]?.code || "";
  });

  const getActiveCoachInfo = (): CoachClassInfo | undefined => {
    return train.classes.find((c) => c.code === selectedClass);
  };

  const handleSelectSeats = () => {
    router.push(`/booking/${train.number}?class=${selectedClass}`);
  };

  const activeInfo = getActiveCoachInfo();

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 train-card-shadow overflow-hidden group hover:border-secondary/30 transition-all duration-300 relative select-none">
      {/* Vande Bharat special background illustration placeholder */}
      {train.type === "Vande Bharat" && (
        <div className="absolute top-0 right-0 w-64 h-full opacity-[0.03] pointer-events-none z-0">
          <img
            className="w-full h-full object-contain"
            alt="Decoration Train Vector"
            src="/train-hero.png"
          />
        </div>
      )}

      <div className="p-6 md:p-8 relative z-10">
        {/* Header Details */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
                {train.number} - {train.name}
              </h2>
              <span
                className={`text-label-sm px-2.5 py-1 rounded font-semibold ${
                  train.badgeType === "success"
                    ? "bg-tertiary-fixed-dim text-on-tertiary-fixed-variant"
                    : train.badgeType === "warning"
                    ? "bg-status-warning/20 text-on-background"
                    : "bg-primary-container text-on-primary-container"
                }`}
              >
                {train.badge}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-label-sm px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-bold">
                {train.type}
              </span>
              <span className="text-label-sm px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
                Superfast
              </span>
            </div>
          </div>

          {/* Time timeline */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-title-md text-title-md text-primary font-bold">{train.departureTime}</p>
              <p className="text-label-sm text-outline">{train.fromStationName}</p>
            </div>
            <div className="flex flex-col items-center min-w-[120px] relative">
              <p className="text-label-sm text-outline mb-1">{train.duration}</p>
              <div className="w-full h-[2px] bg-outline-variant relative flex items-center justify-between">
                <div className="w-2 h-2 rounded-full bg-secondary border border-white -ml-1"></div>
                <div className="w-2 h-2 rounded-full bg-secondary border border-white -mr-1"></div>
                <TrainIcon className="w-4 h-4 text-secondary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-0.5" />
              </div>
              <p className="text-label-sm text-secondary mt-1 font-bold">{train.runsOn}</p>
            </div>
            <div className="text-center">
              <p className="font-title-md text-title-md text-primary font-bold">{train.arrivalTime}</p>
              <p className="text-label-sm text-outline">{train.toStationName}</p>
            </div>
          </div>
        </div>

        {/* Coach / Class Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {train.classes.map((cls) => {
            const isSelected = selectedClass === cls.code;
            return (
              <button
                key={cls.code}
                type="button"
                onClick={() => setSelectedClass(cls.code)}
                className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-secondary bg-secondary/5"
                    : "border-outline-variant hover:border-secondary/50 bg-white"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`font-title-md text-title-md font-bold ${
                      isSelected ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {cls.code}
                  </span>
                  <span className="font-title-md text-title-md text-secondary font-bold">
                    ₹{cls.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {cls.status === "available" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <p className="text-label-md text-secondary font-medium">
                        {cls.availableSeats} Seats Available
                      </p>
                    </>
                  ) : cls.status === "waitlist" ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-error" />
                      <p className="text-label-md text-error font-medium">
                        WL {cls.waitlistNumber} (Waitlisted)
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-outline" />
                      <p className="text-label-md text-outline font-medium">Regret (Closed)</p>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-outline-variant/30">
          <div className="flex gap-4">
            <Link
              href={`/trains/${train.number}`}
              className="text-secondary font-label-md flex items-center gap-2 hover:underline"
            >
              <Info className="w-4.5 h-4.5" />
              Train Schedule
            </Link>
            {train.type === "Vande Bharat" ? (
              <div className="text-on-surface-variant font-label-md flex items-center gap-2">
                <Wifi className="w-4.5 h-4.5 text-secondary" />
                Free Wi-Fi
              </div>
            ) : (
              <div className="text-on-surface-variant font-label-md flex items-center gap-2">
                <Coffee className="w-4.5 h-4.5 text-secondary" />
                Catering Included
              </div>
            )}
          </div>
          <button
            onClick={handleSelectSeats}
            disabled={activeInfo?.status === "regret"}
            className={`w-full sm:w-auto px-10 py-3 rounded-lg font-title-md shadow-lg transition-all text-center ${
              activeInfo?.status === "regret"
                ? "bg-surface-container text-outline cursor-not-allowed"
                : "bg-primary text-on-primary hover:bg-primary-container shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
            }`}
          >
            Select Seats
          </button>
        </div>
      </div>
    </div>
  );
}
