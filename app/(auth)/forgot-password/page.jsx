"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Alert from "@/components/Alert";
import AuthBackground from "@/components/Reusables/Images/AuthBackground";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // step 1 = form, step 2 = message
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [coolDown, setCoolDown] = useState(0);
  const [emailError, setEmailError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setShowAlert(true);
      setAlertType("success");
      setAlertMessage(data.message || "Reset link sent successfully");
      setStep(2); // move to step 2 after success
    } catch (error) {
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLink = async () => {
    if (coolDown > 0) return;
    setCoolDown(60);
    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setShowAlert(true);
      setAlertType("success");
      setAlertMessage(data.message || "Reset link resent successfully");
    } catch (error) {
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage("Failed to resend reset link");
    } finally {
      setIsLoading(false);
    }
  };

  // Cooldown timer
  useEffect(() => {
    if (coolDown <= 0) return;
    const timer = setTimeout(() => {
      setCoolDown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [coolDown]);

  return (
    <>
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
      <AuthBackground>
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-lg dark:border-gray-800 dark:bg-gray-950">
          <div className="w-full max-w-sm space-y-6">
            {/* Title and Subtitle Section */}
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {step === 1 ? "Forgot Password" : "Reset Link Sent"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {step === 1 ? (
                  "Enter your email to receive a password reset link."
                ) : (
                  <>
                    Check your inbox at{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {email}
                    </span>{" "}
                    for the reset link.
                  </>
                )}
              </p>
            </div>

            {/* Field Error Message */}
            {emailError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {emailError}
              </div>
            )}

            {/* Step 1: Email Form */}
            {step === 1 && (
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                autoComplete="off"
              >
                {/* Email Input Field Group */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    // Standard Input Style
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                  />
                </div>

                {/* Submit Button (Standard Button Style) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-gray-600"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-900 dark:border-t-transparent"></div>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Message + Resend */}
            {step === 2 && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <button
                  type="button"
                  onClick={handleResendLink}
                  disabled={isLoading || coolDown > 0}
                  // Updated style to match link/button style consistency
                  className={`${
                    coolDown > 0
                      ? "cursor-default text-gray-500 dark:text-gray-500"
                      : "cursor-pointer font-medium text-gray-900 hover:underline dark:text-white"
                  }`}
                >
                  {coolDown > 0
                    ? `Resend link in ${coolDown}s`
                    : "Resend link?"}
                </button>
              </div>
            )}

            {/* Back to Login always visible (Standard Link Style) */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/login"
                className="font-medium text-gray-900 hover:underline dark:text-white"
              >
                Back to Login
              </Link>
            </div>

            {/* Security Note (Standard Small Print Style) */}
            <p className="text-center text-xs text-gray-500 dark:text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </AuthBackground>
    </>
  );
}
