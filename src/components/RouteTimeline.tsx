import React from "react";
import { TrainRouteStop } from "@/data/trains";

interface RouteTimelineProps {
  stops: TrainRouteStop[];
}

export default function RouteTimeline({ stops }: RouteTimelineProps) {
  return (
    <div className="relative space-y-6 pl-4">
      {stops.map((stop, index) => {
        const isFirst = index === 0;
        const isLast = index === stops.length - 1;

        return (
          <div key={stop.stationCode} className="relative flex gap-6 items-start">
            {/* Timeline Vertical Line Connector */}
            {!isLast && (
              <div className="absolute left-[7px] top-[18px] bottom-[-28px] w-[2px] bg-outline-variant/50 z-0" />
            )}

            {/* Timeline Dot */}
            <div className="relative z-10 flex items-center justify-center mt-1">
              <div
                className={`w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                  isFirst || isLast ? "border-primary" : "border-secondary"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isFirst || isLast ? "bg-primary" : "bg-secondary"
                  }`}
                />
              </div>
            </div>

            {/* Timings and Details Info */}
            <div className="flex-1 bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm hover:border-secondary/20 transition-all flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-base">
                    {stop.stationName}
                  </span>
                  <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded">
                    {stop.stationCode}
                  </span>
                </div>
                <p className="text-xs text-outline font-medium mt-1">
                  Day {stop.day} {stop.stopDuration !== "--" && `| Stop: ${stop.stopDuration}`}
                </p>
              </div>

              <div className="text-right">
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface text-sm">
                    {isFirst ? `Departs: ${stop.departureTime}` : isLast ? `Arrives: ${stop.arrivalTime}` : `Dep: ${stop.departureTime}`}
                  </span>
                  {!isFirst && !isLast && (
                    <span className="text-xs text-outline font-medium">
                      Arr: {stop.arrivalTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
