"use client";

import React from "react";
import { Check } from "lucide-react";

interface JourneyProgressProps {
  currentStep: "train" | "coach" | "seats" | "passenger" | "confirmation";
}

export default function JourneyProgress({ currentStep }: JourneyProgressProps) {
  const steps = [
    { key: "train", label: "Train" },
    { key: "coach", label: "Coach" },
    { key: "seats", label: "Seats" },
    { key: "passenger", label: "Passenger" },
    { key: "confirmation", label: "Confirmed" },
  ];

  const getStepIndex = (key: string) => steps.findIndex((s) => s.key === key);
  const activeIdx = getStepIndex(currentStep);

  return (
    <section className="w-full py-6 select-none bg-white/50 border border-outline-variant/20 rounded-2xl p-6 custom-shadow mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIdx;
          const isActive = idx === activeIdx;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-2">
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-primary text-white"
                      : isActive
                      ? "border-2 border-secondary bg-white text-secondary font-bold"
                      : "border border-outline-variant text-outline bg-white"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4.5 h-4.5 text-white" />
                  ) : isActive ? (
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  ) : (
                    <span className="text-xs font-semibold">{idx + 1}</span>
                  )}
                </div>
                {/* Step Label */}
                <span
                  className={`font-label-sm text-label-sm transition-all ${
                    isCompleted
                      ? "text-primary font-medium"
                      : isActive
                      ? "text-secondary font-bold"
                      : "text-outline"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {/* Step Connector Line */}
              {!isLast && (
                <div
                  className={`flex-1 h-[2px] mx-4 -mt-6 transition-all ${
                    idx < activeIdx ? "bg-primary" : "bg-outline-variant/50"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
