"use client";

import React from "react";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import { ShieldAlert, Eye, LayoutGrid, Zap, Smartphone, CheckCircle2, XCircle, ArrowRight, Train } from "lucide-react";

export default function HomePage() {
  const popularRoutes = [
    { from: "Howrah", to: "New Delhi", fromCode: "HWH", toCode: "NDLS" },
    { from: "Sealdah", to: "Mumbai", fromCode: "SDAH", toCode: "BCT" },
    { from: "Kolkata", to: "Bengaluru", fromCode: "KOAA", toCode: "SBC" },
    { from: "Patna", to: "Chennai", fromCode: "PNBE", toCode: "MAS" },
    { from: "Guwahati", to: "Delhi", fromCode: "GHY", toCode: "NDLS" },
    { from: "Hyderabad", to: "Howrah", fromCode: "HYB", toCode: "HWH" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden bg-background">
        <div className="max-w-container-max mx-auto px-gutter grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            {/* Safe independent branding badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full font-label-md text-label-md font-bold">
              <ShieldAlert className="w-4 h-4" />
              Premium Travel Technology
            </div>
            <h1 className="font-display-lg text-display-lg text-primary tracking-tight leading-tight font-bold">
              Choose Your <span className="text-secondary">Train Seat</span>,<br /> Not Just Your Train
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              India's next-generation railway booking platform with visual coach layouts, smart seat selection, and a premium travel experience.
            </p>
            <div className="flex gap-4">
              <a
                href="#search-section"
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-primary-container hover:shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer scale-98 active:scale-95 duration-200"
              >
                Book Train Tickets
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-secondary/5 rounded-[40px] -rotate-3 transition-transform group-hover:rotate-0 duration-500"></div>
            <img
              alt="Vande Bharat Express Hero Graphic"
              className="relative w-full h-[450px] object-cover rounded-[32px] shadow-2xl z-0"
              src="/train-hero.png"
            />
            {/* Interactive Floating Card */}
            <div className="absolute bottom-8 left-8 right-8 glass-card p-6 rounded-2xl flex items-center gap-4 animate-bounce duration-[3000ms]">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-primary">Live Seat Mapping</p>
                <p className="text-sm text-on-surface-variant">View available window seats in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Input Section */}
      <section id="search-section" className="-mt-20 relative z-20 px-gutter mb-16">
        <div className="max-w-container-max mx-auto">
          <SearchForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-y border-outline-variant/20 select-none">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
              Redefining Indian Rail Travel
            </h2>
            <p className="text-on-surface-variant font-body-lg">
              Stop guessing where you'll sit. We bring absolute clarity and premium utility to every booking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-[24px] bg-background border border-outline-variant/30 hover:border-secondary transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-3">Visual Seat Selection</h3>
              <p className="text-on-surface-variant font-body-md">
                Choose your exact berth or seat from a live visual map of the train coach.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-[24px] bg-background border border-outline-variant/30 hover:border-secondary transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                <LayoutGrid className="w-7 h-7" />
              </div>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-3">Real Coach Layout</h3>
              <p className="text-on-surface-variant font-body-md">
                Understand the proximity to doors, toilets, and windows before you confirm.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-[24px] bg-background border border-outline-variant/30 hover:border-secondary transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-3">Fast Booking</h3>
              <p className="text-on-surface-variant font-body-md">
                Optimized checkout flow that gets you confirmed tickets in under 60 seconds.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-[24px] bg-background border border-outline-variant/30 hover:border-secondary transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-3">Digital Tickets</h3>
              <p className="text-on-surface-variant font-body-md">
                Store all your tickets in one secure app, accessible offline whenever needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-24 bg-background select-none">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary font-bold mb-2">Most Travelled Routes</h2>
              <p className="text-on-surface-variant font-body-md">Explore the busiest corridors in the country.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route) => (
              <Link
                key={`${route.from}-${route.to}`}
                href={`/search?from=${route.fromCode}&to=${route.toCode}`}
                className="group p-6 rounded-2xl bg-white premium-shadow border border-transparent hover:border-secondary/20 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-outline font-semibold">From</p>
                    <p className="font-title-md text-title-md text-primary font-bold">{route.from}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-4 relative">
                    <div className="w-full h-[1px] bg-outline-variant relative">
                      <Train className="w-4 h-4 text-secondary absolute left-1/2 -top-2 -translate-x-1/2 bg-white px-0.5" />
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-xs uppercase tracking-wider text-outline font-semibold">To</p>
                    <p className="font-title-md text-title-md text-primary font-bold">{route.to}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why RailVista Section */}
      <section className="py-24 bg-primary overflow-hidden relative select-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-container/30 skew-x-12 translate-x-1/4"></div>
        <div className="max-w-container-max mx-auto px-gutter relative z-10">
          <div className="text-center mb-16 space-y-2">
            <h2 className="font-headline-lg text-headline-lg text-white font-bold">The Better Way to Travel</h2>
            <p className="text-on-primary-container font-body-lg">We've modernized every step of the journey.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-0 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
            {/* Traditional Platforms */}
            <div className="bg-primary-container/20 p-12 backdrop-blur-sm">
              <div className="mb-8 flex items-center gap-3">
                <XCircle className="w-8 h-8 text-error-container" />
                <h3 className="font-title-md text-title-md text-white/60 font-bold">Traditional Platforms</h3>
              </div>
              <ul className="space-y-6 text-white/60 text-sm font-medium">
                <li className="flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  <p>Automated seat allocation without user choice</p>
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  <p>Complex and cluttered administrative UI</p>
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  <p>No visibility into coach status or amenities</p>
                </li>
              </ul>
            </div>
            {/* RailVista Experience */}
            <div className="bg-white p-12">
              <div className="mb-8 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
                <h3 className="font-title-md text-title-md text-primary font-bold">RailVista Experience</h3>
              </div>
              <ul className="space-y-6 text-primary text-sm font-bold">
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <p>Visual interactive maps for exact seat selection</p>
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <p>Minimalist high-performance interface</p>
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <p>Full coach layout and proximity awareness</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-24 select-none bg-white">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="bg-surface-container-low rounded-[40px] p-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center border border-outline-variant/20 shadow-sm">
            <div>
              <div className="font-display-lg text-display-lg text-primary mb-2 font-bold">100+</div>
              <p className="font-title-md text-title-md text-secondary uppercase tracking-widest font-bold">Major Stations</p>
              <p className="text-on-surface-variant mt-2 text-sm font-semibold">Connecting all metropolitan hubs across India</p>
            </div>
            <div className="border-y md:border-y-0 md:border-x border-outline-variant py-8 md:py-0">
              <div className="font-display-lg text-display-lg text-primary mb-2 font-bold">50+</div>
              <p className="font-title-md text-title-md text-secondary uppercase tracking-widest font-bold">Premium Trains</p>
              <p className="text-on-surface-variant mt-2 text-sm font-semibold">Specializing in Vande Bharat &amp; Tejas routes</p>
            </div>
            <div>
              <div className="font-display-lg text-display-lg text-primary mb-2 font-bold">30,000+</div>
              <p className="font-title-md text-title-md text-secondary uppercase tracking-widest font-bold">Seats Mapped</p>
              <p className="text-on-surface-variant mt-2 text-sm font-semibold">Every berth digitized for your choice</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
