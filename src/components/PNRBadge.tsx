import React from "react";

export default function PNRBadge({ pnr }: { pnr: string }) {
  return (
    <span className="bg-white/15 text-white border border-white/30 px-4 py-1.5 rounded-full font-mono text-base tracking-wider font-bold inline-block select-all shadow-sm">
      {pnr}
    </span>
  );
}
