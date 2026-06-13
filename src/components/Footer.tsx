"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Mail, Phone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <footer className="bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant dark:border-outline mt-auto full-width">
      <div className="w-full py-12 px-gutter max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              alt="RailVista Logo"
              className="h-8 w-auto object-contain"
              src="/logo.png"
            />
            <span className="text-title-md font-title-md font-bold text-primary dark:text-primary-fixed">
              RailVista
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant max-w-xs">
            Revolutionizing rail bookings through visual coach layout maps and high-performance ticketing interfaces.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-outline-variant/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all"
              aria-label="Website"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-outline-variant/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-outline-variant/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all"
              aria-label="Support Phone"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-title-md text-title-md text-primary dark:text-primary-fixed-dim mb-6 font-bold">
            Quick Links
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="/my-bookings" className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary transition-colors">
                My Bookings
              </Link>
            </li>
            <li>
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary transition-colors">
                Live Status
              </Link>
            </li>
            <li>
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary transition-colors">
                PNR Enquiry
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="font-title-md text-title-md text-primary dark:text-primary-fixed-dim mb-6 font-bold">
            Policies
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-secondary transition-colors">
                Refund Rules
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment and Copyright */}
      <div className="w-full border-t border-outline-variant dark:border-outline py-6">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant text-center md:text-left">
            © 2026 RailVista Technologies. RailVista is an independent product and is not affiliated with or endorsed by official railway authorities.
          </p>
        </div>
      </div>
    </footer>
  );
}
