"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HotpointSvgLogo } from "@/public/assets";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || "Reset link set successfully");
      setShowMessage(true);
    } catch (error) {
      setMessage("Failed to send reset link");
      setShowMessage(true);
    } finally {
      setIsLoading(false);
      setEmail("");
    }
  };

  const handleResend = () => {
    setShowMessage(false);
    setMessage("");
    setEmail("");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      {/* Logo */}
      <HotpointSvgLogo />

      <div className="w-full max-w-[400px] px-8">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-semibold text-red-800">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {showMessage
              ? "Check your email inbox for the reset link."
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {/* Show message and resend option */}
        {showMessage ? (
          <div className="text-center">
            <p className="mb-6 text-sm text-green-600">{message}</p>
            <button
              onClick={handleResend}
              className="w-full rounded-full bg-red-600 p-3 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
            >
              Resend Reset Link
            </button>
          </div>
        ) : (
          /* Show Message */
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" " // <-- important to trigger :placeholder-shown behavior
                className="peer w-full rounded-full border border-gray-300 px-4 py-3 placeholder-transparent focus:outline-none"
              />
              <label
                htmlFor="email"
                className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Email Address
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-red-600 p-3 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-red-400"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-red-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
