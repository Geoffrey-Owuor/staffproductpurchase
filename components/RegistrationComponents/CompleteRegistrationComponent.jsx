"use client";

import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { AuthPagesLogo } from "@/public/assets";
import ThemeToggle from "../Reusables/ThemeProviders/ThemeToggle";

export default function CompleteRegistrationComponent({ email }) {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/register/completeregistration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      let dashboardPath;
      if (data.role === "hr") dashboardPath = "/hrdashboard";
      else if (data.role === "cc") dashboardPath = "/ccdashboard";
      else if (data.role === "bi") dashboardPath = "/bidashboard";
      else dashboardPath = "/staffdashboard";

      window.location.href = dashboardPath;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      {/* Logo */}
      <div className="fixed top-3.5 left-4 z-50">
        <AuthPagesLogo />
      </div>
      {/* Card */}
      <div className="w-full max-w-[400px] px-8">
        <h1 className="mb-8 text-center text-3xl font-semibold">
          Complete Registration
        </h1>
        {error && (
          <div className="mb-4 text-center text-sm text-red-700">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="text-center text-sm text-green-600 dark:text-green-400">
            Email verified successfully!
          </div>
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full rounded-full border border-gray-300 bg-transparent px-4 py-3 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
            />
            <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300">
              Full Name
            </label>
          </div>
          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              placeholder=" "
              className="peer w-full rounded-full border border-gray-300 bg-transparent px-4 py-3 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
            />
            <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300">
              Password
            </label>
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
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full rounded-full border border-gray-300 bg-transparent px-4 py-3 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
            />
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  passwords do not match
                </p>
              )}
            <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300">
              Confirm Password
            </label>
          </div>
          <button
            type="submit"
            disabled={
              loading ||
              (formData.confirmPassword &&
                formData.password !== formData.confirmPassword)
            }
            className={`w-full rounded-full px-4 py-3 font-medium text-white transition duration-200 ${
              loading ||
              (formData.confirmPassword &&
                formData.password !== formData.confirmPassword)
                ? "cursor-not-allowed disabled:bg-gray-400"
                : "bg-gray-900 hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                Completing...
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-900 dark:border-t-transparent"></div>
              </div>
            ) : (
              <>Complete</>
            )}
          </button>
        </form>
        {/* Security note */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Secure company login • Do not share your credentials
        </p>
      </div>
      {/* Theme Toggle - Bottom Right */}
      <div className="absolute right-4 bottom-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
