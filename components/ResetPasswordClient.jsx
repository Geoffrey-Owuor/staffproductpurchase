"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthPagesLogo } from "@/public/assets";
import { Eye, EyeClosed } from "lucide-react";
import ThemeToggle from "./Reusables/ThemeProviders/ThemeToggle";
import Alert from "./Alert";

export default function ResetPasswordClient({ token }) {
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
          window.location.href = "/login";
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
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
        {/* Logo */}
        <div className="fixed top-3.5 left-4 z-50">
          <AuthPagesLogo />
        </div>
        <div className="w-full max-w-[400px] px-8">
          <h1 className="mb-10 text-center text-3xl font-semibold">
            Reset Your Password
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
                placeholder=" "
                minLength="8"
                className="peer w-full rounded-full border border-gray-300 bg-transparent px-4 py-3 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
              />
              <label
                htmlFor="password"
                className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300"
              >
                Password
              </label>
              {/* Eye Icon */}
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                placeholder=" "
                className="peer w-full rounded-full border border-gray-300 bg-transparent px-4 py-3 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
              />
              {passwordError && (
                <p className="ml-2 text-sm text-red-600">{passwordError}</p>
              )}
              <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300">
                Confirm Password
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading || passwordError}
              className="w-full rounded-full bg-gray-900 p-3 font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
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
          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-gray-700 hover:underline dark:text-gray-300 dark:hover:text-white"
            >
              Back to Login
            </Link>
          </div>
        </div>
        {/* Theme Toggle - Bottom Right */}
        <div className="fixed right-4 bottom-4 z-50">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
