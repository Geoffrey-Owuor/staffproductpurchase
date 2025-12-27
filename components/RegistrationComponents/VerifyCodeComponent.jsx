"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import AlertPopup from "../Reusables/AlertPopup";
import AuthBackground from "../Reusables/Images/AuthBackground";

export default function VerifyCodeComponent({ email }) {
  const router = useRouter();

  // creating a state for an array to hold the 6 digits
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [coolDown, setCoolDown] = useState(0);

  // New refs to control focus
  const inputRefs = useRef([]);

  // Derived state to check if the code is full ---
  const isCodeFull = otp.join("").length === 6;

  //Refactored submission logic
  // Using useCallback to memoize the function so
  // it can be used in useEffect without causing infinite loops
  const submitCode = useCallback(
    async (codeToSubmit) => {
      if (loading) return; //Prevent multiple submissions
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/register/verifycode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: codeToSubmit }),
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Verification failed");

        // Response is ok - push user to complete registration
        router.push("/register/completeregistration");
      } catch (error) {
        setError(error.message);
        setOtp(new Array(6).fill("")); //Clear otp on error
        setLoading(false);
        // Focus the first input on error
        inputRefs.current[0]?.focus();
      }
    },
    [email, router],
  );

  //useEffect for auto-submission
  useEffect(() => {
    if (isCodeFull) {
      submitCode(otp.join(""));
    }
  }, [otp, submitCode, isCodeFull]);

  // --- MODIFIED: Handles form submission via Enter key or button click ---
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isCodeFull) {
      submitCode(otp.join(""));
    }
  };

  // New function to handle typing and auto-focus next
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow single digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); //Get only the last character;
    setOtp(newOtp);

    //Move focus to the next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handling backspace pressing
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // If backspace is pressed on empty input, focus previous one
      inputRefs.current[index - 1]?.focus();

      // Clear previous input value
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  //Handle pasting a six digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(paste)) {
      setOtp(paste.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const resendCode = async () => {
    if (coolDown > 0) return;
    setCoolDown(60);
    try {
      await fetch("/api/register/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch (error) {
      console.error("Resend failed", error);
    }
  };

  // Add a useEffect to manage the timer
  useEffect(() => {
    if (coolDown <= 0) return;
    const timer = setTimeout(() => {
      setCoolDown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [coolDown]);

  return (
    <AuthBackground>
      <AlertPopup
        message="Verification code has been resent!"
        show={showAlert}
      />
      {/* Card */}
      <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-lg dark:border-gray-800 dark:bg-gray-950">
        <div className="w-full max-w-sm space-y-6">
          {/* Title and Subtitle Section */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Verification Code
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If the email exists, a 6-digit verification code has been sent to{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {email}
              </span>
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
            onSubmit={handleFormSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            {/* 6 box input layout */}
            <div
              className="flex justify-center space-x-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{1}"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  required
                  disabled={loading}
                  // Styling updated to match input fields and use focus rings
                  className="h-12 w-10 rounded-lg border border-gray-300 bg-white text-center text-lg font-semibold text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:w-12 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                />
              ))}
            </div>

            {/* Submit Button (Standard Button Style) */}
            <button
              type="submit"
              disabled={!isCodeFull || loading}
              // Updated button classes to match login button style
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-gray-600"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-900 dark:border-t-transparent"></div>
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </button>
          </form>

          {/* Resend Code Link */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Didn't receive a code?{" "}
            <button
              type="button"
              onClick={resendCode}
              // Updated resend button styling for consistency
              className={`${coolDown > 0 ? "cursor-default" : "cursor-pointer hover:underline"} font-medium text-gray-900 dark:text-white`}
              disabled={coolDown > 0}
            >
              {coolDown > 0 ? `Resend code in ${coolDown}s` : "Resend code"}
            </button>
          </div>

          {/* Security note (Matches the small print at the bottom of the login form) */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </AuthBackground>
  );
}
