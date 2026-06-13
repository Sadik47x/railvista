"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
      } else {
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
          Welcome Back
        </h2>
        <p className="font-body-md text-sm text-on-surface-variant max-w-xs mx-auto">
          Sign in to access your digital tickets, PNR status updates, and travel history.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-margin-mobile sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl border border-outline-variant/30 rounded-2xl sm:px-10 space-y-6">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-3.5 rounded-xl text-sm font-semibold text-center select-text">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="space-y-2 relative">
              <label className="block text-xs font-label-sm text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 pr-12 font-body-md text-body-md transition-all rounded-t-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-secondary cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-outline" /> : <Eye className="w-5 h-5 text-outline" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-label-md">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="remember" className="text-on-surface-variant cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link href="#" className="text-secondary hover:underline font-bold">
                Forgot password?
              </Link>
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
                "Sign In"
              )}
            </button>
          </form>

          <div className="h-px bg-outline-variant/40 my-6"></div>

          <div className="text-center text-sm">
            <span className="text-on-surface-variant">New to RailVista? </span>
            <Link href="/signup" className="text-secondary font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
