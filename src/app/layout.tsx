import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MainLayout from "@/components/MainLayout";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RailVista | Premium Railway Booking",
  description: "India's next-generation railway booking platform with visual coach layouts, smart seat selection, and a premium travel experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        <AuthProvider>
          <BookingProvider>
            <Navbar />
            <MainLayout>{children}</MainLayout>
            <Footer />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
