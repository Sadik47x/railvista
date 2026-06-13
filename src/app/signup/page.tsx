"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: signUpError } = await signUp(email, password, name);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        // Successful signup, redirect to dashboard
        router.push("/my-bookings");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="absolute top-8 left-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-secondary font-label-md hover:underline font-bold"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 select-none">
        <div className="flex justify-center">
          <img
            alt="RailVista Logo"
            className="h-12 w-auto object-contain"
            src="/logo.png"
          />
        </div>
        <h2 className="font-display-lg text-[32px] text-primary font-bold tracking-tight">
          Create Account
        </h2>
        <p className="font-body-md text-sm text-on-surface-variant max-w-xs mx-auto">
          Join RailVista to book visual coach seats and experience hassle-free digital checkouts.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-margin-mobile sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl border border-outline-variant/30 rounded-2xl sm:px-10 space-y-6">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-3.5 rounded-xl text-sm font-semibold text-center select-text">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-xs font-label-sm text-on-surface-variant">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-body-md text-body-md transition-all rounded-t-lg"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-label-sm text-on-surface-variant">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-body-md text-body-md transition-all rounded-t-lg"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-label-sm text-on-surface-variant">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-body-md text-body-md transition-all rounded-t-lg"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-xs font-label-sm text-on-surface-variant">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 font-body-md text-body-md transition-all rounded-t-lg"
              />
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 text-xs font-label-md py-1">
              <input
                type="checkbox"
                required
                id="terms"
                className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer mt-0.5"
              />
              <label htmlFor="terms" className="text-on-surface-variant cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link href="#" className="text-secondary font-bold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-secondary font-bold hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold shadow hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer scale-98 active:scale-95 duration-200"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="h-px bg-outline-variant/40 my-6"></div>

          <div className="text-center text-sm">
            <span className="text-on-surface-variant">Already have an account? </span>
            <Link href="/login" className="text-secondary font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
