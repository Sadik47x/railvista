"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Train as TrainType } from "@/data/trains";
import { trainService } from "@/services/train.service";
import RouteTimeline from "@/components/RouteTimeline";
import { ArrowLeft, Calendar, Train, Clock, Star, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function TrainDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const trainId = params.id as string;

  const [train, setTrain] = useState<TrainType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    trainService.getTrainByNumber(trainId).then((data) => {
      if (active) {
        setTrain(data);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [trainId]);

  if (isLoading) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-24 text-center space-y-4 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
        <p className="text-on-surface-variant font-body-md">Loading train schedules and details...</p>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-24 text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-outline mx-auto" />
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
          Train Not Found
        </h1>
        <p className="text-on-surface-variant max-w-sm mx-auto text-sm">
          The train number <strong>#{trainId}</strong> does not exist in our system. Please check your query.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-md hover:bg-primary-container"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  const handleBookClass = (classCode: string) => {
    router.push(`/booking/${train.number}?class=${classCode}`);
  };

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-gutter py-8 space-y-10">
      {/* Back to search link */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-secondary font-label-md hover:underline font-bold cursor-pointer"
      >
        <ArrowLeft className="w-4.5 h-4.5" />
        Back to Search Results
      </button>

      {/* Train Header Hero Card */}
      <section className="relative bg-white rounded-xl shadow-[0px_8px_24px_rgba(0,51,153,0.08)] border border-outline-variant/20 overflow-hidden select-none">
        <div className="absolute top-0 left-0 w-2.5 h-full bg-primary"></div>
        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {train.type}
              </span>
              <span className="text-primary font-bold font-title-md text-title-md">
                #{train.number}
              </span>
            </div>
            <h1 className="text-primary font-headline-lg text-headline-lg font-bold">
              {train.name}
            </h1>
            <p className="text-on-surface-variant font-body-md text-body-md flex items-center justify-center md:justify-start gap-2">
              <Calendar className="w-4 h-4 text-secondary" />
              Runs {train.runsOn}
            </p>
          </div>

          {/* Time Progress bar */}
          <div className="flex items-center gap-6 md:gap-12 flex-1 justify-center max-w-2xl">
            <div className="text-center">
              <div className="text-primary font-bold font-headline-lg text-headline-lg">{train.departureTime}</div>
              <div className="text-on-surface-variant font-title-md text-title-md font-bold">{train.fromStationCode}</div>
              <div className="text-outline font-label-sm text-label-sm">{train.fromStationName}</div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="text-outline font-label-sm text-label-sm">{train.duration}</div>
              <div className="w-full h-px bg-outline-variant relative flex items-center justify-between">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <Train className="w-4 h-4 text-secondary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1.5" />
              </div>
              <div className="text-secondary font-label-sm text-label-sm font-semibold">Direct Route</div>
            </div>
            <div className="text-center">
              <div className="text-primary font-bold font-headline-lg text-headline-lg">{train.arrivalTime}</div>
              <div className="text-on-surface-variant font-title-md text-title-md font-bold">{train.toStationCode}</div>
              <div className="text-outline font-label-sm text-label-sm">{train.toStationName}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Schedule vs Class Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Timetable */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,51,153,0.04)] border border-outline-variant/20 p-8 space-y-6">
          <h3 className="text-primary font-title-md text-title-md font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Route Timetable & Station Stops
          </h3>
          <RouteTimeline stops={train.route} />
        </div>

        {/* Right Column: Classes and Highlights */}
        <div className="lg:col-span-5 space-y-6">
          {/* Class Booking Options */}
          <div className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,51,153,0.04)] border border-outline-variant/20 p-6 space-y-6">
            <h3 className="text-primary font-title-md text-title-md font-bold">
              Select Class to Book
            </h3>
            <div className="space-y-4">
              {train.classes.map((cls) => (
                <div
                  key={cls.code}
                  className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest hover:border-secondary transition-all"
                >
                  <div>
                    <h4 className="font-title-md text-sm font-bold text-primary">{cls.name}</h4>
                    <p className="text-xs text-outline mt-0.5">
                      {cls.status === "available"
                        ? `${cls.availableSeats} seats remaining`
                        : cls.status === "waitlist"
                        ? `WL ${cls.waitlistNumber} (Waitlisted)`
                        : "Regret (Closed)"}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="font-title-md text-title-md text-secondary font-bold">
                      ₹{cls.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => handleBookClass(cls.code)}
                      disabled={cls.status === "regret"}
                      className={`px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-all cursor-pointer ${
                        cls.status === "regret"
                          ? "bg-surface-container text-outline cursor-not-allowed"
                          : "bg-primary text-on-primary hover:bg-primary-container scale-98 active:scale-95 duration-200"
                      }`}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Info */}
          <div className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,51,153,0.04)] border border-outline-variant/20 p-6 space-y-4">
            <h3 className="text-primary font-title-md text-title-md font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-secondary" />
              Train Amenities
            </h3>
            <ul className="space-y-3">
              {train.highlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <CheckCircle2 className="w-4.5 h-4.5 text-secondary" />
                  <span className="font-body-md">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
