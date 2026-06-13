"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Train as TrainType } from "@/data/trains";
import { Coach } from "@/data/coaches";
import { Seat } from "@/data/seats";
import { trainService } from "@/services/train.service";
import { coachService } from "@/services/coach.service";
import { seatService } from "@/services/seat.service";
import { useBooking } from "@/context/BookingContext";
import JourneyProgress from "@/components/JourneyProgress";
import CoachSelector from "@/components/CoachSelector";
import SeatMap from "@/components/SeatMap";
import BookingSummary from "@/components/BookingSummary";
import { Loader2 } from "lucide-react";

function SeatSelectionContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    setSelectedTrain,
    setSelectedClass,
    setSelectedSeats,
    setSearchQuery,
    searchQuery,
  } = useBooking();

  const trainId = params.id as string;
  const classParam = searchParams.get("class") || "3A";

  const [train, setTrain] = useState<TrainType | null>(null);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<string>("");
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatsState, setSelectedSeatsState] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Train and Coach records
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    
    Promise.all([
      trainService.getTrainByNumber(trainId, searchQuery.date),
      coachService.getCoachesForTrain(trainId)
    ]).then(([trainData, coachesData]) => {
      if (active) {
        setTrain(trainData);
        setCoaches(coachesData);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [trainId, searchQuery.date]);

  const classCoaches = coaches.filter((c) => c.classCode === classParam);
  const activeCoaches = classCoaches.length > 0 ? classCoaches : coaches;

  // Initialize selected coach
  useEffect(() => {
    if (activeCoaches.length > 0) {
      // Default to "B2" if present (Stitch design default), otherwise first coach
      const hasB2 = activeCoaches.some((c) => c.id === "B2");
      setSelectedCoachId(hasB2 ? "B2" : activeCoaches[0].id);
    }
  }, [activeCoaches]);

  // Generate seats when coach changes
  useEffect(() => {
    if (selectedCoachId && trainId) {
      seatService.getSeatsForCoach(selectedCoachId, trainId, searchQuery.date).then((data) => {
        setSeats(data);
        // Clear selected seats when coach changes to prevent multi-coach selections
        setSelectedSeatsState([]);
      });
    }
  }, [selectedCoachId, trainId, searchQuery.date]);

  if (isLoading) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-24 text-center space-y-4 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
        <p className="text-on-surface-variant font-body-md">Loading visual coach layouts...</p>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-24 text-center">
        <p className="text-lg font-bold text-primary">Train not found</p>
      </div>
    );
  }

  const handleToggleSeat = (seatId: string) => {
    setSelectedSeatsState((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleProceed = () => {
    // Save selections to BookingContext
    setSelectedTrain(train);
    setSelectedClass(classParam);
    setSelectedSeats(selectedSeatsState);
    
    // Sync search query date if needed
    setSearchQuery({
      ...searchQuery,
      classCode: classParam,
    });

    router.push("/passenger-details");
  };

  const availableSeatsCount = seats.filter((s) => s.isAvailable).length;

  return (
    <div className="max-w-container-max mx-auto px-gutter py-8 space-y-6">
      {/* Top Banner Schedule Summary Info */}
      <section className="bg-surface-container-low border border-outline-variant/35 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 select-none">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Active Booking Train
          </span>
          <span className="font-title-md text-title-md text-primary font-bold">
            {train.number} {train.name}
          </span>
        </div>
        <div className="flex gap-8 items-center text-sm text-on-surface-variant font-medium">
          <div className="flex flex-col text-center md:text-left">
            <span className="font-label-sm text-label-sm text-outline">ROUTE</span>
            <span>{train.fromStationCode} → {train.toStationCode}</span>
          </div>
          <div className="w-[1px] h-8 bg-outline-variant"></div>
          <div className="flex flex-col text-center md:text-left">
            <span className="font-label-sm text-label-sm text-outline">CLASS</span>
            <span className="font-bold text-secondary">{classParam}</span>
          </div>
        </div>
      </section>

      {/* Progress Funnel Tracker */}
      <JourneyProgress currentStep="seats" />

      {/* 2-Column Booking Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Coach Selector & Seat Grid */}
        <section className="lg:col-span-8 space-y-8">
          <CoachSelector
            coaches={activeCoaches}
            selectedCoachId={selectedCoachId}
            onSelectCoach={setSelectedCoachId}
            availableSeatsCount={availableSeatsCount}
          />
          <SeatMap
            seats={seats}
            selectedSeats={selectedSeatsState}
            onToggleSeat={handleToggleSeat}
          />
        </section>

        {/* Right Column: Ticket Fare Summary */}
        <div className="lg:col-span-4">
          <BookingSummary
            train={train}
            classCode={classParam}
            selectedSeats={selectedSeatsState}
            passengerCount={selectedSeatsState.length}
            onSubmit={handleProceed}
            submitButtonText="Proceed to Passenger Info"
          />
        </div>
      </div>
    </div>
  );
}

export default function SeatSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
            <span className="text-sm font-label-md text-outline">Loading coach layout...</span>
          </div>
        </div>
      }
    >
      <SeatSelectionContent />
    </Suspense>
  );
}
