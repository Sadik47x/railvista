"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { stations as mockStations } from "@/data/stations";
import { stationService } from "@/services/station.service";
import { MapPin, Navigation, Calendar, Search, ArrowLeftRight } from "lucide-react";

interface SearchFormProps {
  initialValues?: {
    from: string;
    to: string;
    date: string;
    classCode: string;
    quota: string;
  };
  compact?: boolean;
}

export default function SearchForm({ initialValues, compact = false }: SearchFormProps) {
  const router = useRouter();

  const [stationsList, setStationsList] = useState(mockStations);

  useEffect(() => {
    let active = true;
    stationService.getStations().then((data) => {
      if (active) {
        setStationsList(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const [from, setFrom] = useState(initialValues?.from || "HWH");
  const [to, setTo] = useState(initialValues?.to || "NDLS");
  const [date, setDate] = useState(initialValues?.date || "2026-07-15");
  const [classCode, setClassCode] = useState(initialValues?.classCode || "3A");
  const [quota, setQuota] = useState(initialValues?.quota || "General");

  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const filteredFromStations = stationsList.filter(
    (s) =>
      s.name.toLowerCase().includes(fromSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToStations = stationsList.filter(
    (s) =>
      s.name.toLowerCase().includes(toSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(toSearch.toLowerCase())
  );

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
        to
      )}&date=${encodeURIComponent(date)}&class=${encodeURIComponent(
        classCode
      )}&quota=${encodeURIComponent(quota)}`
    );
  };

  const getStationLabel = (code: string) => {
    const station = stationsList.find((s) => s.code === code);
    return station ? `${station.name} (${station.code})` : code;
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-wrap gap-4 items-end justify-between select-none">
        <div className="flex-1 min-w-[200px] relative">
          <label className="block text-xs font-label-sm text-on-surface-variant mb-1">From</label>
          <button
            type="button"
            onClick={() => {
              setShowFromDropdown(!showFromDropdown);
              setShowToDropdown(false);
            }}
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-3 py-2 text-left font-label-md text-label-md cursor-pointer flex justify-between items-center"
          >
            <span>{getStationLabel(from)}</span>
          </button>
          {showFromDropdown && (
            <div className="absolute top-full left-0 w-full bg-white border border-outline-variant rounded shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
              <input
                type="text"
                placeholder="Search station..."
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                className="w-full border-b border-outline-variant p-2 text-sm focus:ring-0 focus:border-secondary"
              />
              {filteredFromStations.map((station) => (
                <div
                  key={station.code}
                  onClick={() => {
                    setFrom(station.code);
                    setShowFromDropdown(false);
                    setFromSearch("");
                  }}
                  className="px-3 py-2 hover:bg-secondary/5 cursor-pointer text-sm font-body-md"
                >
                  {station.name} ({station.code})
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSwap}
          className="bg-surface-container hover:bg-surface-variant p-2 rounded-full transition-colors self-center mb-1 cursor-pointer"
        >
          <ArrowLeftRight className="w-4 h-4 text-secondary" />
        </button>

        <div className="flex-1 min-w-[200px] relative">
          <label className="block text-xs font-label-sm text-on-surface-variant mb-1">To</label>
          <button
            type="button"
            onClick={() => {
              setShowToDropdown(!showToDropdown);
              setShowFromDropdown(false);
            }}
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-3 py-2 text-left font-label-md text-label-md cursor-pointer flex justify-between items-center"
          >
            <span>{getStationLabel(to)}</span>
          </button>
          {showToDropdown && (
            <div className="absolute top-full left-0 w-full bg-white border border-outline-variant rounded shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
              <input
                type="text"
                placeholder="Search station..."
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                className="w-full border-b border-outline-variant p-2 text-sm focus:ring-0 focus:border-secondary"
              />
              {filteredToStations.map((station) => (
                <div
                  key={station.code}
                  onClick={() => {
                    setTo(station.code);
                    setShowToDropdown(false);
                    setToSearch("");
                  }}
                  className="px-3 py-2 hover:bg-secondary/5 cursor-pointer text-sm font-body-md"
                >
                  {station.name} ({station.code})
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-40">
          <label className="block text-xs font-label-sm text-on-surface-variant mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-3 py-2 font-label-md text-label-md focus:border-secondary focus:ring-0"
          />
        </div>

        <button
          type="submit"
          className="bg-secondary text-on-secondary px-6 py-2 rounded font-bold hover:bg-primary transition-all flex items-center gap-2 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 md:p-10 rounded-[32px] premium-shadow border border-outline-variant/30 select-none"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* From */}
        <div className="space-y-2 relative">
          <label className="font-label-md text-label-md text-on-surface-variant ml-1 flex items-center gap-1.5 font-bold">
            <MapPin className="w-4 h-4 text-secondary" /> From
          </label>
          <button
            type="button"
            onClick={() => {
              setShowFromDropdown(!showFromDropdown);
              setShowToDropdown(false);
            }}
            className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-title-md text-title-md text-left transition-all rounded-t-lg flex justify-between items-center cursor-pointer"
          >
            <span>{getStationLabel(from)}</span>
          </button>
          {showFromDropdown && (
            <div className="absolute top-full left-0 w-full bg-white border border-outline-variant rounded-b-lg shadow-xl z-50 max-h-60 overflow-y-auto mt-1">
              <input
                type="text"
                placeholder="Type to search..."
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                className="w-full border-b border-outline-variant p-3 text-sm focus:ring-0 focus:border-secondary"
                autoFocus
              />
              {filteredFromStations.length > 0 ? (
                filteredFromStations.map((station) => (
                  <div
                    key={station.code}
                    onClick={() => {
                      setFrom(station.code);
                      setShowFromDropdown(false);
                      setFromSearch("");
                    }}
                    className="px-4 py-3 hover:bg-secondary/5 cursor-pointer text-base font-body-md border-b border-outline-variant/20 last:border-0"
                  >
                    <p className="font-bold text-primary">{station.name}</p>
                    <p className="text-xs text-on-surface-variant">{station.city} ({station.code})</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-outline text-center">No stations found</div>
              )}
            </div>
          )}
        </div>

        {/* To */}
        <div className="space-y-2 relative">
          <label className="font-label-md text-label-md text-on-surface-variant ml-1 flex items-center gap-1.5 font-bold">
            <Navigation className="w-4 h-4 text-secondary" /> To
          </label>
          <button
            type="button"
            onClick={() => {
              setShowToDropdown(!showToDropdown);
              setShowFromDropdown(false);
            }}
            className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-title-md text-title-md text-left transition-all rounded-t-lg flex justify-between items-center cursor-pointer"
          >
            <span>{getStationLabel(to)}</span>
          </button>
          {showToDropdown && (
            <div className="absolute top-full left-0 w-full bg-white border border-outline-variant rounded-b-lg shadow-xl z-50 max-h-60 overflow-y-auto mt-1">
              <input
                type="text"
                placeholder="Type to search..."
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                className="w-full border-b border-outline-variant p-3 text-sm focus:ring-0 focus:border-secondary"
                autoFocus
              />
              {filteredToStations.length > 0 ? (
                filteredToStations.map((station) => (
                  <div
                    key={station.code}
                    onClick={() => {
                      setTo(station.code);
                      setShowToDropdown(false);
                      setToSearch("");
                    }}
                    className="px-4 py-3 hover:bg-secondary/5 cursor-pointer text-base font-body-md border-b border-outline-variant/20 last:border-0"
                  >
                    <p className="font-bold text-primary">{station.name}</p>
                    <p className="text-xs text-on-surface-variant">{station.city} ({station.code})</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-outline text-center">No stations found</div>
              )}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="font-label-md text-label-md text-on-surface-variant ml-1 flex items-center gap-1.5 font-bold">
            <Calendar className="w-4 h-4 text-secondary" /> Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-title-md text-title-md transition-all rounded-t-lg cursor-pointer"
          />
        </div>

        {/* Class/Quota */}
        <div className="grid grid-cols-2 gap-4 col-span-1">
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1 font-bold">Class</label>
            <select
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-2 py-3 font-label-md text-label-md rounded-t-lg cursor-pointer"
            >
              <option value="SL">Sleeper</option>
              <option value="3A">3A Tier</option>
              <option value="2A">2A Tier</option>
              <option value="1A">1A Tier</option>
              <option value="CC">AC Chair</option>
              <option value="EC">Exec Chair</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1 font-bold">Quota</label>
            <select
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-2 py-3 font-label-md text-label-md rounded-t-lg cursor-pointer"
            >
              <option value="General">General</option>
              <option value="Ladies">Ladies</option>
              <option value="Senior">Senior</option>
              <option value="Tatkal">Tatkal</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-secondary text-on-secondary h-[56px] rounded-xl font-bold text-body-lg shadow-lg hover:bg-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-5 h-5" /> Search Trains
          </button>
        </div>
      </div>
    </form>
  );
}
