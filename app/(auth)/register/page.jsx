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
      <div className="rounded-xl border border-gray-300 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-950">
        <h1 className="mb-8 text-center text-2xl font-semibold">
          Verify Your Email
        </h1>
        {/* Small note */}
        <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email to receive a verification code
        </p>
        {error && (
          <div className="mb-4 text-center text-sm text-red-700">{error}</div>
        )}
        <form
          onSubmit={handleEmailSubmit}
          className="space-y-2"
          autoComplete="off"
        >
          <div className="relative">
            <input
              type="email"
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
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                Sending...
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-900 dark:border-t-transparent"></div>
              </div>
            ) : (
              <>Send Verification Code</>
            )}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-gray-700 hover:underline dark:text-gray-300 dark:hover:text-white"
          >
            Login
          </Link>
        </div>
        {/* Security note (same as login) */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Secure company login • Do not share your credentials
        </p>
      </div>
    </AuthBackground>
  );
}
