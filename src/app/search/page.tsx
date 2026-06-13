"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Train } from "@/data/trains";
import { trainService } from "@/services/train.service";
import TrainCard from "@/components/TrainCard";
import SearchForm from "@/components/SearchForm";
import { Train as TrainIcon, Edit2, X, SunDim, Sun, Sunset, Moon, Grid, List, ChevronDown, Frown } from "lucide-react";

function SearchResultsContent() {
  const searchParams = useSearchParams();

  const fromVal = searchParams.get("from") || "HWH";
  const toVal = searchParams.get("to") || "NDLS";
  const dateVal = searchParams.get("date") || "15 July 2026";
  const classVal = searchParams.get("class") || "3A";
  const quotaVal = searchParams.get("quota") || "General";

  const [isEditing, setIsEditing] = useState(false);
  const [trainsList, setTrainsList] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    trainService.getTrains(fromVal, toVal, dateVal).then((data) => {
      if (active) {
        setTrainsList(data);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [fromVal, toVal, dateVal]);

  // Filter States
  const [selectedCoaches, setSelectedCoaches] = useState<string[]>([classVal]);
  const [timeFilter, setTimeFilter] = useState<string[]>([]);
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("duration");

  const toggleCoachFilter = (code: string) => {
    if (selectedCoaches.includes(code)) {
      setSelectedCoaches(selectedCoaches.filter((c) => c !== code));
    } else {
      setSelectedCoaches([...selectedCoaches, code]);
    }
  };

  const toggleTimeFilter = (time: string) => {
    if (timeFilter.includes(time)) {
      setTimeFilter(timeFilter.filter((t) => t !== time));
    } else {
      setTimeFilter([...timeFilter, time]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCoaches([]);
    setTimeFilter([]);
    setAvailabilityOnly(false);
  };

  // Helper to parse duration string "17h 05m" into total minutes
  const parseDuration = (durationStr: string): number => {
    const parts = durationStr.split(" ");
    let total = 0;
    parts.forEach((p) => {
      if (p.includes("h")) total += parseInt(p) * 60;
      if (p.includes("m")) total += parseInt(p);
    });
    return total;
  };

  // Filter & Sort Logic
  const filteredTrains = trainsList
    .filter((train) => {
      // Check route matching (mock matches HWH and NDLS generally)
      const matchesRoute =
        (train.fromStationCode === fromVal || fromVal === "ANY") &&
        (train.toStationCode === toVal || toVal === "ANY");

      if (!matchesRoute) return false;

      // Filter by Coach classes selected
      if (selectedCoaches.length > 0) {
        const hasMatchingClass = train.classes.some((c) =>
          selectedCoaches.some((sc) => c.code.toLowerCase().includes(sc.toLowerCase()) || sc.toLowerCase().includes(c.code.toLowerCase()))
        );
        if (!hasMatchingClass) return false;
      }

      // Filter by Departure Timings
      if (timeFilter.length > 0) {
        const hr = parseInt(train.departureTime.split(":")[0]);
        let period = "";
        if (hr >= 5 && hr < 12) period = "Morning";
        else if (hr >= 12 && hr < 17) period = "Afternoon";
        else if (hr >= 17 && hr < 21) period = "Evening";
        else period = "Night";

        if (!timeFilter.includes(period)) return false;
      }

      // Filter by seat availability
      if (availabilityOnly) {
        const hasAvailable = train.classes.some((c) => c.status === "available");
        if (!hasAvailable) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "duration") {
        return parseDuration(a.duration) - parseDuration(b.duration);
      }
      if (sortBy === "earliest") {
        return a.departureTime.localeCompare(b.departureTime);
      }
      if (sortBy === "latest") {
        return b.departureTime.localeCompare(a.departureTime);
      }
      if (sortBy === "price") {
        const cheapestA = Math.min(...a.classes.map((c) => c.price));
        const cheapestB = Math.min(...b.classes.map((c) => c.price));
        return cheapestA - cheapestB;
      }
      return 0;
    });

  return (
    <div className="flex-grow flex flex-col min-h-screen">
      {/* Search Summary Ribbon */}
      <div className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-gutter py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <TrainIcon className="w-5 h-5 text-primary" />
            <p className="font-title-md text-title-md text-primary font-bold">
              {fromVal} → {toVal} | {dateVal} | Class: {classVal} | Quota: {quotaVal}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 text-secondary font-label-md px-4 py-2 rounded-full border border-secondary hover:bg-secondary/5 transition-colors cursor-pointer"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? "Close" : "Edit Search"}
          </button>
        </div>

        {/* Collapsible search form */}
        {isEditing && (
          <div className="bg-white border-b border-outline-variant/30 p-6 shadow-inner">
            <div className="max-w-container-max mx-auto">
              <SearchForm
                initialValues={{
                  from: fromVal,
                  to: toVal,
                  date: dateVal,
                  classCode: classVal,
                  quota: quotaVal,
                }}
                compact
              />
            </div>
          </div>
        )}
      </div>

      <main className="flex-grow max-w-container-max mx-auto w-full px-gutter py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Filters Panel */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
            <div className="bg-surface-container-lowest p-6 rounded-xl filter-shadow border border-outline-variant/30 space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                <h2 className="font-title-md text-title-md text-primary font-bold">Filters</h2>
                <button onClick={clearAllFilters} className="text-secondary text-label-sm font-semibold cursor-pointer">
                  Clear All
                </button>
              </div>

              {/* Coach Type Filter */}
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider font-bold">
                  Coach Type
                </h3>
                <div className="space-y-3">
                  {["SL", "3A", "2A", "1A", "CC", "EC"].map((code) => (
                    <label key={code} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCoaches.includes(code)}
                        onChange={() => toggleCoachFilter(code)}
                        className="w-5 h-5 rounded border-outline text-secondary focus:ring-secondary cursor-pointer"
                      />
                      <span className="font-body-md text-body-md group-hover:text-primary transition-colors text-on-surface">
                        {code} class
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Departure Timings */}
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider font-bold">
                  Departure Time
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "Morning", icon: <SunDim className="w-5 h-5" />, label: "Morning (5a-12p)" },
                    { key: "Afternoon", icon: <Sun className="w-5 h-5" />, label: "Afternoon (12p-5p)" },
                    { key: "Evening", icon: <Sunset className="w-5 h-5" />, label: "Evening (5p-9p)" },
                    { key: "Night", icon: <Moon className="w-5 h-5" />, label: "Night (9p-5a)" },
                  ].map((time) => {
                    const isSelected = timeFilter.includes(time.key);
                    return (
                      <button
                        key={time.key}
                        type="button"
                        onClick={() => toggleTimeFilter(time.key)}
                        className={`flex flex-col items-center p-3 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "border-secondary bg-secondary/5 text-secondary"
                            : "border-outline-variant hover:border-secondary text-on-surface-variant"
                        }`}
                      >
                        <div className={`${isSelected ? "text-secondary" : "text-outline"}`}>
                          {time.icon}
                        </div>
                        <span className="text-[10px] mt-1 font-semibold text-center">{time.key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider font-bold">
                  Availability
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="avail"
                      checked={!availabilityOnly}
                      onChange={() => setAvailabilityOnly(false)}
                      className="w-5 h-5 border-outline text-secondary focus:ring-secondary cursor-pointer"
                    />
                    <span className="font-body-md text-body-md text-on-surface">All Statuses</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="avail"
                      checked={availabilityOnly}
                      onChange={() => setAvailabilityOnly(true)}
                      className="w-5 h-5 border-outline text-secondary focus:ring-secondary cursor-pointer"
                    />
                    <span className="font-body-md text-body-md text-on-surface">Available Only</span>
                  </label>
                </div>
              </div>

              {/* Sort logic */}
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider font-bold">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-3 font-body-md focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option value="duration">Shortest Duration</option>
                  <option value="earliest">Earliest Departure</option>
                  <option value="latest">Latest Departure</option>
                  <option value="price">Lowest Price</option>
                </select>
              </div>
            </div>
            
            {/* Promo spot */}
            <div className="rounded-xl overflow-hidden relative h-48 group shadow-sm">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="High speed train promo"
                src="/train-hero.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex items-end p-6">
                <p className="text-white font-title-md font-bold leading-tight">
                  Seamless visual seat maps on every journey.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Train Card Results */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex justify-between items-center px-2">
              <p className="font-body-md text-on-surface-variant">
                Showing <strong>{filteredTrains.length}</strong> Trains for <strong>{fromVal} → {toVal}</strong>
              </p>
              <div className="flex gap-2">
                <button className="bg-surface-container-high p-2 rounded-lg hover:bg-surface-variant transition-colors"><Grid className="w-5 h-5 text-primary" /></button>
                <button className="bg-primary text-on-primary p-2 rounded-lg"><List className="w-5 h-5 text-white" /></button>
              </div>
            </div>

            {isLoading ? (
              <div className="bg-white p-24 text-center rounded-2xl border border-outline-variant/30 shadow-sm space-y-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-on-surface-variant font-body-md mt-4">Searching for matching trains...</p>
              </div>
            ) : filteredTrains.length > 0 ? (
              <div className="space-y-6">
                {filteredTrains.map((train) => (
                  <TrainCard key={train.number} train={train} defaultClassCode={classVal} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
                <Frown className="w-16 h-16 text-outline-variant mx-auto" />
                <p className="text-lg font-bold text-primary">No Trains Found</p>
                <p className="text-on-surface-variant text-sm max-w-sm mx-auto">
                  We couldn't find any trains matching your filters. Try clearing some selections or changing your route.
                </p>
              </div>
            )}

            {/* Pagination/Load More */}
            <div className="flex justify-center py-8">
              <button className="flex items-center gap-2 text-primary font-title-md bg-surface-container hover:bg-surface-variant px-8 py-3 rounded-full transition-all cursor-pointer font-bold">
                Load 10 More Trains
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
            <span className="text-sm font-label-md text-outline">Searching trains...</span>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
