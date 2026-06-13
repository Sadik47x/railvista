import React from "react";

export default function QRSection({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-2xl border border-outline-variant/30 select-none">
      <div className="w-16 h-16 bg-white p-1.5 rounded-lg border border-outline-variant/50 relative flex items-center justify-center">
        {/* Generates a clean mock QR Code visual representation */}
        <div
          className="w-full h-full opacity-80"
          style={{
            backgroundImage: "radial-gradient(#002068 2px, transparent 2px), radial-gradient(#002068 2px, transparent 2px)",
            backgroundSize: "6px 6px",
            backgroundPosition: "0 0, 3px 3px",
          }}
        ></div>
        {/* QR Position Anchors */}
        <div className="absolute w-3.5 h-3.5 bg-white border-2 border-primary top-1 left-1 flex items-center justify-center">
          <div className="w-1 h-1 bg-primary"></div>
        </div>
        <div className="absolute w-3.5 h-3.5 bg-white border-2 border-primary top-1 right-1 flex items-center justify-center">
          <div className="w-1 h-1 bg-primary"></div>
        </div>
        <div className="absolute w-3.5 h-3.5 bg-white border-2 border-primary bottom-1 left-1 flex items-center justify-center">
          <div className="w-1 h-1 bg-primary"></div>
        </div>
      </div>
      <div>
        <p className="font-bold text-primary text-xs uppercase tracking-wider">Visual Boarding QR</p>
        <p className="text-[10px] text-outline font-medium max-w-[140px] leading-tight">
          Scan at the coach entrance for real-time verification.
        </p>
      </div>
    </div>
  );
}
