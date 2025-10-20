"use client";

import { useState, useEffect } from "react";
import { Mail, Loader2, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Alert from "../Alert";
import { LoggingOutOverlay } from "../Reusables/LoadingBar";

export default function ChangeEmail({ onClose }) {
  const { email: oldEmail } = useUser();
  const [step, setStep] = useState("step1");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [coolDown, setCoolDown] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  // Simple email format validation regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Effect to validate inputs on change
  useEffect(() => {
    if (newEmail && !validateEmail(newEmail)) {
      setError("Please enter a valid email address.");
    } else if (newEmail && confirmEmail && newEmail !== confirmEmail) {
      setError("The email addresses do not match.");
    } else {
      setError("");
    }
  }, [newEmail, confirmEmail]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await fetch("/api/register/verifyemail", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowAlert(true);
        setAlertType("success");
        setAlertMessage(data.message || "Verification Code Sent");
        setStep("step2");
      } else {
        setShowAlert(true);
        setAlertType("error");
        setAlertMessage(data.message || "Failed to send code");
      }
    } catch (error) {
      console.error("Failed to send code", error);
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage(error.message || "Failed to send code");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await fetch("/api/register/verifycode", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newemail: newEmail,
          code: verificationCode,
          oldemail: oldEmail,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowAlert(true);
        setAlertType("success");
        setAlertMessage(data.message || "Email updated successfully");
        setVerificationCode("");

        //Call the logout api endpoint
        await fetch("/api/logout", { method: "POST" });

        //Redirect to login page after a short delay
        setTimeout(() => {
          setLoggingOut(true);
          window.location.href = "/login";
        }, 3000); //3 second delay for the user to read the alert
      } else {
        setShowAlert(true);
        setAlertType("error");
        setAlertMessage(data.message || "Failed to verify code");
      }
    } catch (error) {
      console.error("Failed to update email", error);
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage(error.message || "Failed to update email");
    } finally {
      setUpdating(false);
    }
  };

  const handleResendCode = async (e) => {
    if (coolDown > 0) return;
    setCoolDown(60);
    await handleVerifyEmail(e);
  };

  // Add a useEffect to manage the timer
  useEffect(() => {
    if (coolDown <= 0) return;
    const timer = setTimeout(() => {
      setCoolDown(coolDown - 1);
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
      {loggingOut && <LoggingOutOverlay isLoggingOut={loggingOut} />}
      <div className="custom-blur fixed inset-0 z-50 flex items-center justify-center bg-white/50 p-4 dark:bg-gray-950/50">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-950">
          {step === "step1" && (
            <>
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Change Your Email
                </h3>
                <button
                  onClick={onClose}
                  className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close dialog"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleVerifyEmail} className="mt-4 space-y-4">
                {/* New Email Field */}
                <div>
                  <label
                    htmlFor="new-email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    New Email Address
                  </label>
                  <div className="relative mt-1">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      id="new-email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-10 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Email Field */}
                <div>
                  <label
                    htmlFor="confirm-email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm New Email
                  </label>
                  <div className="relative mt-1">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      id="confirm-email"
                      type="email"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      placeholder="Confirm your new email"
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-10 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-500">
                    {error}
                  </p>
                )}

                {/* Informational Text */}
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  A verification code will be sent to this new email address to
                  confirm the change.
                </p>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={!!error || !newEmail || !confirmEmail || sending}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Code"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
          {step === "step2" && (
            <>
              {/* Header */}
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Verify Your New Email
                </h3>
                <button
                  onClick={onClose}
                  className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close dialog"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Informational Text */}
              <div className="mt-6 mb-7 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A 6-digit verification code has been sent to
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {" "}
                    {newEmail}
                  </span>
                </p>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleVerifyCode} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="verification-code"
                    className="sr-only" // Screen-reader only label
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="------"
                    maxLength="6"
                    className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-center text-2xl tracking-[0.5em] text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center space-y-4 pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-950 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-50"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("step1")} // Action to go back
                    className="cursor-pointer text-xs text-gray-600 hover:underline dark:text-gray-400"
                  >
                    Use a different email
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode} // Action to resend code
                    className={`${coolDown > 0 ? "cursor-default" : "cursor-pointer hover:underline"} text-xs text-gray-600 dark:text-gray-400`}
                  >
                    {coolDown > 0
                      ? `Resend code in ${coolDown}s`
                      : "Resend code?"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
