"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <main className={`flex-grow ${isAuthPage ? "" : "pt-20"}`}>
      {children}
    </main>
  );
}
