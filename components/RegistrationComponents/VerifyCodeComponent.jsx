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
      <div className="rounded-xl border border-gray-300 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-950">
        <h1 className="mb-8 text-center text-2xl font-semibold">
          Verification Code
        </h1>
        <p className="mb-7 text-center text-sm text-gray-600 dark:text-gray-400">
          If the email exists, a 6-digit verification code has been sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>
        {error && (
          <div className="mb-4 text-center text-sm text-red-700">{error}</div>
        )}
        <form
          onSubmit={handleFormSubmit}
          className="space-y-6"
          autoComplete="off"
        >
          {/* 6 box input layout */}
          <div className="flex justify-center space-x-2" onPaste={handlePaste}>
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
                className="h-14 w-10 rounded-xl border border-gray-300 bg-transparent text-center text-2xl font-semibold tracking-widest focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:w-12 dark:border-gray-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isCodeFull || loading}
            className={`w-full rounded-xl px-4 py-3 font-semibold text-white transition duration-200 dark:text-gray-900 ${
              !isCodeFull || loading
                ? "cursor-not-allowed disabled:bg-gray-400"
                : "bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                Verifying...
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-900 dark:border-t-transparent"></div>
              </div>
            ) : (
              <>Verify</>
            )}
          </button>
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Didn't receive a code?{" "}
            <button
              type="button"
              onClick={resendCode}
              className={`${coolDown > 0 ? "cursor-default" : "cursor-pointer hover:underline"} font-semibold text-gray-700 dark:text-gray-300 dark:hover:text-white`}
            >
              {coolDown > 0 ? `Resend code in ${coolDown}s` : "Resend code"}
            </button>
          </div>
        </form>
        {/* Security note */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Secure company login • Do not share your credentials
        </p>
      </div>
    </AuthBackground>
  );
}
