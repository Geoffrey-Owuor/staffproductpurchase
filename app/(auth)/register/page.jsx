"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Step1Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <Image
        src="/hotpoint_logo.png"
        alt="Company Logo"
        width={150}
        height={150}
        className="mx-auto h-20 w-auto"
        priority
      />
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-semibold text-red-800">
          Verify Your Email
        </h1>
        {/* Disclaimer */}
        <p className="mb-4 text-center text-sm text-gray-500">
          Enter a valid email address
        </p>

        {error && <div className="mb-4 text-center text-red-700">{error}</div>}

        <form
          onSubmit={handleEmailSubmit}
          className="space-y-5"
          autoComplete="off"
        >
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
              className="peer w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-transparent focus:outline-none"
            />
            <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600">
              Email Address
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer rounded-xl px-4 py-3 font-medium text-white transition duration-200 ${
              loading
                ? "cursor-not-allowed bg-red-400"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  Sending...
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                </div>
              </>
            ) : (
              <>Send Verification Code</>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-red-600 hover:underline"
            >
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
