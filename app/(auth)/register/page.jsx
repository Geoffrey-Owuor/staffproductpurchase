"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthBackground from "@/components/Reusables/Images/AuthBackground";

export default function Step1Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  // Simple email format validation regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }, [email]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send code");

      router.push("/register/verifycode");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
      <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-950">
        <div className="w-full max-w-sm space-y-6">
          {/* Title and Subtitle Section */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email to receive a verification code
            </p>
          </div>

          {/* Global Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form Section */}
          <form
            onSubmit={handleEmailSubmit}
            className="space-y-4"
            autoComplete="off"
          >
            <div className="space-y-2">
              {/* Email Label (Explicit Label Style) */}
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Email Address
              </label>
              {/* Email Input (Standard Input Style) */}
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
              />
            </div>

            {/* Field-Specific Error Message */}
            {emailError && (
              <p className="text-sm text-red-600 dark:text-red-500">
                {emailError}
              </p>
            )}

            {/* Submit Button (Standard Button Style) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-gray-600"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-900 dark:border-t-transparent"></div>
                  Sending...
                </span>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-gray-900 hover:underline dark:text-white"
            >
              Login
            </Link>
          </div>

          {/* Security Note (Same as Login's placeholder note) */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </AuthBackground>
  );
}
