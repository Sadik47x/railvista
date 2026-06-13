"use client";

import React from "react";

export default function DesignSystemPage() {
  const colors = [
    { name: "Primary", hex: "#002068", desc: "Midnight Blue for core branding, main nav, and primary context", text: "text-white" },
    { name: "Primary Container", hex: "#003399", desc: "Medium Blue for active states and containers", text: "text-white" },
    { name: "Secondary", hex: "#0058bc", desc: "Interactive Blue for buttons, links, and highlights", text: "text-white" },
    { name: "Tertiary", hex: "#002e1c", desc: "Deep green base", text: "text-white" },
    { name: "Tertiary Container", hex: "#00472d", desc: "Dark forest green for success badge containers", text: "text-white" },
    { name: "On Tertiary Container", hex: "#00c081", desc: "Mint Green for positive success indicators", text: "text-primary" },
    { name: "Background", hex: "#fcf9f8", desc: "Base background color, crisp off-white", text: "text-on-surface" },
    { name: "Surface Container Lowest", hex: "#ffffff", desc: "Pure white for card and form backgrounds", text: "text-on-surface" },
    { name: "Surface Container Low", hex: "#f6f3f2", desc: "Slightly darker container shading", text: "text-on-surface" },
    { name: "Outline", hex: "#747684", desc: "Gray for standard borders, input outlines, and captions", text: "text-white" },
    { name: "Outline Variant", hex: "#c4c5d5", desc: "Soft borders", text: "text-on-surface" },
    { name: "Status Warning", hex: "#FEBB02", desc: "Gold/yellow for warning chips or delays", text: "text-primary" },
  ];

  const typography = [
    { key: "display-lg", name: "Display Large", size: "48px", weight: "Bold (700)", line: "56px", spacing: "-0.02em", class: "font-display-lg" },
    { key: "headline-lg", name: "Headline Large", size: "32px", weight: "Semi-Bold (600)", line: "40px", spacing: "Normal", class: "font-headline-lg" },
    { key: "headline-lg-mobile", name: "Headline Large (Mobile)", size: "24px", weight: "Semi-Bold (600)", line: "32px", spacing: "Normal", class: "font-headline-lg-mobile" },
    { key: "title-md", name: "Title Medium", size: "20px", weight: "Semi-Bold (600)", line: "28px", spacing: "Normal", class: "font-title-md" },
    { key: "body-lg", name: "Body Large", size: "18px", weight: "Regular (400)", line: "28px", spacing: "Normal", class: "font-body-lg" },
    { key: "body-md", name: "Body Medium", size: "16px", weight: "Regular (400)", line: "24px", spacing: "Normal", class: "font-body-md" },
    { key: "label-md", name: "Label Medium", size: "14px", weight: "Medium (500)", line: "20px", spacing: "0.01em", class: "font-label-md" },
    { key: "label-sm", name: "Label Small", size: "12px", weight: "Semi-Bold (600)", line: "16px", spacing: "Normal", class: "font-label-sm" },
  ];

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12 space-y-16">
      {/* Page Header */}
      <section className="space-y-4">
        <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
          RailVista Design System
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Visual documentation of the design system components, typography styles, shadows, shapes, and color palettes exported from Stitch.
        </p>
      </section>

      {/* Colors Section */}
      <section className="space-y-6">
        <h2 className="font-headline-lg text-headline-lg text-primary border-b border-outline-variant/30 pb-3">
          1. Brand Colors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {colors.map((color) => (
            <div
              key={color.name}
              className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm flex flex-col"
            >
              <div
                className={`h-24 flex items-end p-4 font-mono font-bold text-sm ${color.text}`}
                style={{ backgroundColor: color.hex }}
              >
                {color.hex}
              </div>
              <div className="p-4 flex-1 space-y-1">
                <h3 className="font-title-md text-sm font-bold text-primary">{color.name}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{color.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section className="space-y-6">
        <h2 className="font-headline-lg text-headline-lg text-primary border-b border-outline-variant/30 pb-3">
          2. Typography
        </h2>
        <div className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-container-low text-primary font-bold border-b border-outline-variant/30">
                <th className="p-4">Style Key / Class</th>
                <th className="p-4">Details</th>
                <th className="p-4">Visual Sample</th>
              </tr>
            </thead>
            <tbody>
              {typography.map((type) => (
                <tr key={type.key} className="border-b border-outline-variant/20 last:border-0">
                  <td className="p-4 font-mono">
                    <p className="font-bold text-primary">{type.key}</p>
                    <p className="text-xs text-outline">.{type.class}</p>
                  </td>
                  <td className="p-4 text-xs space-y-0.5 text-on-surface-variant">
                    <p><strong>Size:</strong> {type.size}</p>
                    <p><strong>Weight:</strong> {type.weight}</p>
                    <p><strong>Line Height:</strong> {type.line}</p>
                    {type.spacing !== "Normal" && <p><strong>Letter Spacing:</strong> {type.spacing}</p>}
                  </td>
                  <td className="p-4">
                    <span className={type.class}>Visual Sample ({type.name})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Components Section */}
      <section className="space-y-6">
        <h2 className="font-headline-lg text-headline-lg text-primary border-b border-outline-variant/30 pb-3">
          3. Interactive Elements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buttons */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 space-y-6">
            <h3 className="font-title-md text-primary font-bold">Buttons</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <button className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-primary-container transition-all cursor-pointer">
                  Primary Solid
                </button>
                <button className="bg-secondary text-on-secondary px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-primary transition-all cursor-pointer">
                  Secondary Solid
                </button>
                <button className="border-2 border-secondary text-secondary hover:bg-secondary/5 px-6 py-2.5 rounded-xl font-bold transition-all cursor-pointer">
                  Secondary Outlined
                </button>
              </div>
              <p className="text-xs text-outline">
                Solid buttons use Midnight Blue (#002068) or Secondary Blue (#0058bc). Radiuses vary between 8px (Pill-shape) and 12px (Rounded corner cards).
              </p>
            </div>
          </div>

          {/* Input Fields */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 space-y-6">
            <h3 className="font-title-md text-primary font-bold">Input Fields</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-label-sm text-on-surface-variant font-semibold">
                  Sample Text Input
                </label>
                <input
                  type="text"
                  placeholder="Enter text..."
                  className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-body-md text-body-md transition-all rounded-t-lg"
                />
              </div>
              <p className="text-xs text-outline">
                Inputs use bottom borders matching the outline variant color (#c4c5d5), which transitions to a thick Secondary Blue (#0058bc) highlight on focus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards, Elevation, Shadows Section */}
      <section className="space-y-6">
        <h2 className="font-headline-lg text-headline-lg text-primary border-b border-outline-variant/30 pb-3">
          4. Cards & Depth
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Elevated Card */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between h-40">
            <span className="font-label-sm text-outline uppercase tracking-wider">Elevated Card</span>
            <div>
              <p className="font-bold text-primary text-base">Train Info Card</p>
              <p className="text-xs text-outline mt-1">Class: .train-card-shadow</p>
            </div>
          </div>

          {/* Premium Ambient Shadow Card */}
          <div className="bg-white p-6 rounded-[24px] border border-outline-variant/30 premium-shadow flex flex-col justify-between h-40">
            <span className="font-label-sm text-outline uppercase tracking-wider">Premium Shadow Card</span>
            <div>
              <p className="font-bold text-primary text-base">Search Bar Container</p>
              <p className="text-xs text-outline mt-1">Class: .premium-shadow</p>
            </div>
          </div>

          {/* Glass Card */}
          <div className="relative rounded-[24px] overflow-hidden bg-[url('/train-hero.png')] bg-cover flex items-center justify-center p-4 h-40">
            <div className="absolute inset-0 bg-primary/20"></div>
            <div className="glass-card p-4 rounded-xl text-center z-10 w-full">
              <p className="font-bold text-primary text-sm">Live Seat Mapping</p>
              <p className="text-xs text-on-surface-variant">Class: .glass-card</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
