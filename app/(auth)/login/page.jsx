"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";
import { AuthPagesLogo } from "@/public/assets";
import ThemeToggle from "@/components/Reusables/ThemeProviders/ThemeToggle";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [redirect, setRedirect] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRedirect(true);
    setLoginError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Determine dashboard path based on role
        let dashboardPath;
        if (data.role === "hr") {
          dashboardPath = "/hrdashboard";
        } else if (data.role === "cc") {
          dashboardPath = "/ccdashboard";
        } else if (data.role === "bi") {
          dashboardPath = "/bidashboard";
        } else {
          dashboardPath = "/staffdashboard";
        }

        // Redirect with page reload
        window.location.href = dashboardPath;
      } else {
        const data = await response.json();
        setLoginError(data.message || "Login Failed");
        setRedirect(false);
      }
    } catch (error) {
      setLoginError("Network Error. Please Try Again.");
      setRedirect(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      {/* Company Logo */}
      <div className="fixed top-3.5 left-4 z-50">
        <AuthPagesLogo />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[400px] px-8">
        <h1 className="mb-10 text-center text-3xl font-semibold">
          Welcome Back
        </h1>

        {loginError && (
          <div className="mb-4 text-center text-sm text-red-600 dark:text-red-400">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full rounded-full border border-gray-300 bg-transparent px-4 py-3 text-gray-900 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
            />
            <label
              htmlFor="email"
              className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300"
            >
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full rounded-full border border-gray-300 bg-transparent px-4 py-3 text-gray-900 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
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
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={redirect}
            className={`w-full rounded-full px-4 py-3 font-medium text-white transition duration-200 ${
              redirect
                ? "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
                : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            }`}
          >
            {redirect ? (
              <div className="flex items-center justify-center gap-2">
                Logging in...
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </div>
            ) : (
              <>Login</>
            )}
          </button>

          {/* Forgot Password */}
          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="text-gray-900 hover:underline dark:text-gray-200"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </form>

        {/* Sign Up */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-gray-900 hover:underline dark:text-white"
          >
            Sign up
          </Link>
        </div>

        {/* Security note */}
        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          Secure company login • Do not share your credentials
        </p>
      </div>

      {/* Theme Toggle - Bottom Right */}
      <div className="fixed right-4 bottom-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
