"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, User, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Correct navbar (removed Design System)
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "My Bookings", href: "/my-bookings" },
  ];

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
      router.push("/");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <header className="bg-surface dark:bg-surface-dim shadow-sm docked full-width fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 border-b border-outline-variant/30">
      <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-20">
        {/* Logo and Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <img
              alt="RailVista Logo"
              className="h-10 w-auto object-contain cursor-pointer"
              src="/logo.png"
            />
            <span className="font-display-lg text-display-lg text-primary tracking-tight font-bold hidden xs:inline-block">
              RailVista
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    isActive
                      ? "text-secondary font-bold border-b-2 border-secondary pb-1"
                      : "text-on-surface-variant dark:text-on-surface hover:text-secondary transition-colors"
                  } font-title-md text-title-md`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4 text-on-surface-variant">
            <button className="hover:text-secondary transition-colors cursor-pointer" aria-label="Notifications">
              <Bell className="w-6 h-6 text-primary" />
            </button>
            <Link href="/my-bookings" className="hover:text-secondary transition-colors" aria-label="Profile">
              <User className="w-6 h-6 text-primary" />
            </Link>
          </div>
          <div className="h-6 w-px bg-outline-variant/50"></div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-label-md text-sm text-on-surface-variant select-none">
                Hi, <strong>{displayName}</strong>
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 border border-outline-variant hover:bg-surface-container text-on-surface px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-error" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-secondary font-bold px-4 py-2 hover:bg-secondary/5 rounded-lg transition-all scale-98 active:scale-95 duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-primary-container transition-all scale-98 active:scale-95 duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-primary hover:opacity-85 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-outline-variant px-margin-mobile py-4 space-y-4 absolute top-20 left-0 w-full shadow-lg z-50">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-2 ${
                    isActive ? "text-secondary font-bold" : "text-on-surface-variant"
                  } font-title-md text-title-md`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <div className="h-px bg-outline-variant/50 my-2"></div>
          
          {user ? (
            <div className="space-y-4 pt-2">
              <p className="font-label-md text-sm text-on-surface-variant">
                Logged in as <strong>{displayName}</strong>
              </p>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 border border-error/40 text-error hover:bg-error/5 py-2.5 rounded-full font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-secondary font-bold py-2 hover:bg-secondary/5 rounded-lg border border-secondary"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-primary text-on-primary py-2.5 rounded-full font-bold shadow-md hover:bg-primary-container"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
