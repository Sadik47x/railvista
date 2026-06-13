"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Train } from "@/data/trains";
import { Booking } from "@/data/bookings";
import { PassengerData } from "@/components/PassengerCard";
import { bookingService } from "@/services/booking.service";

interface BookingContextType {
  searchQuery: {
    from: string;
    to: string;
    date: string;
    classCode: string;
    quota: string;
  };
  setSearchQuery: (query: {
    from: string;
    to: string;
    date: string;
    classCode: string;
    quota: string;
  }) => void;
  selectedTrain: Train | null;
  setSelectedTrain: (train: Train | null) => void;
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  selectedSeats: string[];
  setSelectedSeats: (seats: string[]) => void;
  passengers: PassengerData[];
  setPassengers: (passengers: PassengerData[]) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  recentBooking: Booking | null;
  setRecentBooking: (booking: Booking | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState({
    from: "HWH",
    to: "NDLS",
    date: "2026-07-15",
    classCode: "3A",
    quota: "General",
  });
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("3A");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<PassengerData[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [recentBooking, setRecentBooking] = useState<Booking | null>(null);

  // Sync state from database/service layer
  useEffect(() => {
    bookingService.getBookings().then((data) => {
      setBookings(data);
    });
  }, []);

  const addBooking = async (booking: Booking) => {
    const finalBooking = await bookingService.createBooking(booking);
    const updated = await bookingService.getBookings();
    setBookings(updated);
    if (finalBooking) {
      setRecentBooking(finalBooking);
    } else {
      setRecentBooking(booking);
    }
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    const success = await bookingService.cancelBooking(bookingId);
    const updated = await bookingService.getBookings();
    setBookings(updated);
    return success;
  };

  return (
    <BookingContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedTrain,
        setSelectedTrain,
        selectedClass,
        setSelectedClass,
        selectedSeats,
        setSelectedSeats,
        passengers,
        setPassengers,
        bookings,
        addBooking,
        cancelBooking,
        recentBooking,
        setRecentBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
