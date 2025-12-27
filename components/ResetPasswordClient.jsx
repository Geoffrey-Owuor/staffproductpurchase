"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthBackground from "./Reusables/Images/AuthBackground";
import { Eye, EyeClosed } from "lucide-react";
import Alert from "./Alert";

export default function ResetPasswordClient({ token }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear error when user starts typing in first field
    if (passwordError && confirmPassword) {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value && password !== value) {
      setPasswordError("passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowAlert(true);
        setMessageType("success");
        setMessage(data.message || "Password reset successful!");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setShowAlert(true);
        setMessageType("error");
        setMessage(data.message || "Failed to reset password");
      }
    } catch (error) {
      setShowAlert(true);
      setMessageType("error");
      setMessage("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showAlert && (
        <Alert
          message={message}
          type={messageType}
          onClose={() => setShowAlert(false)}
        />
      )}
      <AuthBackground>
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-lg dark:border-gray-800 dark:bg-gray-950">
          <div className="w-full max-w-sm space-y-6">
            {/* Title Section */}
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Reset Your Password
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter and confirm your new password below.
              </p>
            </div>

            {/* Error Message (Using Block Style for consistency) */}
            {passwordError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {passwordError}
              </div>
            )}

            {/* Form Section */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              autoComplete="off"
            >
              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    placeholder="••••••••"
                    minLength="8"
                    // Standard Input Style
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    placeholder="••••••••"
                    // Standard Input Style
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                  />
                </div>
              </div>

              {/* Submit Button (Standard Button Style) */}
              <button
                type="submit"
                disabled={isLoading || passwordError}
                className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-gray-600"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-900 dark:border-t-transparent"></div>
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            {/* Back to Login Link (Standard Link Style) */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/login"
                className="font-medium text-gray-900 hover:underline dark:text-white"
              >
                Back to Login
              </Link>
            </div>

            {/* Security Note */}
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
