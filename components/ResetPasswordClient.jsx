"use client";

import { useState } from "react";
// import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthPagesLogo } from "@/public/assets";
import { Eye, EyeClosed } from "lucide-react";
import ThemeToggle from "./Reusables/ThemeProviders/ThemeToggle";

export default function ResetPasswordClient({ token }) {
  // const searchParams = useSearchParams();
  // const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
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
      setPassword("");
      setConfirmPassword("");

      if (res.ok) {
        setMessage(data.message || "Password reset successful!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      } else {
        setMessage(data.message || "Failed to reset password");
      }
    } catch (error) {
      setMessage("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      {/* Logo */}
      <div className="fixed top-3.5 left-4 z-50">
        <AuthPagesLogo />
      </div>

      <div className="w-full max-w-[400px] px-8">
        <h1 className="mb-10 text-center text-3xl font-semibold">
          Reset Your Password
        </h1>
        {message && (
          <p className="mb-5 text-center text-sm text-green-600 dark:text-green-400">
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
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
      <div className="absolute right-4 bottom-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
