"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AlertPopup from "../Reusables/AlertPopup";
import Image from "next/image";

export default function VerifyCodeComponent({ email }) {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register/verifycode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Verification failed");

      router.push("/register/completeregistration");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const resendCode = async () => {
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      {/* Logo */}
      <Image
        src="/hotpoint_logo.png"
        alt="Company Logo"
        width={150}
        height={150}
        className="mx-auto h-20 w-auto"
        priority
      />
      <AlertPopup message="Verification code resent!" show={showAlert} />

      {/* Card */}
      <div className="w-full max-w-[400px] px-8">
        <h1 className="mb-4 text-center text-2xl font-semibold text-red-800">
          Verification Code
        </h1>

        <p className="mb-7 text-center text-sm text-gray-500">
          If the email exists, a 6-digit verification code has been sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>

        {error && (
          <div className="mb-4 text-center text-sm text-red-700">{error}</div>
        )}

        <form
          onSubmit={handleCodeSubmit}
          className="space-y-6"
          autoComplete="off"
        >
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength="6"
              placeholder=" "
              className="peer w-full rounded-full border border-gray-300 px-4 py-3 text-center text-xl tracking-widest placeholder-transparent focus:outline-none"
            />
            <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600">
              Enter verification code
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full px-4 py-3 font-medium text-white transition duration-200 ${
              loading
                ? "cursor-not-allowed bg-red-400"
                : "cursor-pointer bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                Verifying...
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </div>
            ) : (
              <>Verify</>
            )}
          </button>

          <div className="mt-4 text-center text-sm text-gray-600">
            Didn’t receive a code?{" "}
            <button
              type="button"
              onClick={resendCode}
              className="cursor-pointer font-medium text-red-600 hover:underline"
            >
              Resend
            </button>
          </div>
        </form>

        {/* Security note */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Secure company login • Do not share your credentials
        </p>
      </div>
    </div>
  );
}
