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
        <div className="rounded-xl border border-gray-300 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-semibold">
              {step === 1 ? "Forgot Password" : "Reset Link Sent"}
            </h1>
            <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
              {step === 1 ? (
                "Enter your email to receive a password reset link."
              ) : (
                <>
                  Check your inbox at{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {email}
                  </span>{" "}
                  for the reset link.
                </>
              )}
            </p>
          </div>

          {/* Step 1: Email Form */}
          {step === 1 && (
            <form
              onSubmit={handleSubmit}
              className="space-y-2"
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
                  placeholder=" "
                  className="peer w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-gray-900 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
                />
                <label
                  htmlFor="email"
                  className="absolute -top-3 left-4 rounded-md bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300"
                >
                  Email Address
                </label>
              </div>
              {/* Error Message */}
              {emailError && (
                <p className="ml-2 text-sm text-red-600 dark:text-red-500">
                  {emailError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
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
            <div className="mt-6 space-y-3 text-center">
              <button
                type="button"
                onClick={handleResendLink}
                disabled={isLoading || coolDown > 0}
                className={`${
                  coolDown > 0
                    ? "cursor-default text-gray-400"
                    : "cursor-pointer text-gray-600 hover:underline dark:text-gray-400 dark:hover:text-white"
                } text-sm`}
              >
                {coolDown > 0 ? `Resend code in ${coolDown}s` : "Resend code?"}
              </button>
            </div>
          )}

          {/* Back to Login always visible */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-700 hover:underline dark:text-gray-300 dark:hover:text-white"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </AuthBackground>
    </>
  );
}
