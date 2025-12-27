"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthBackground from "../Reusables/Images/AuthBackground";
import Alert from "../Alert";
import { useRouter } from "next/navigation";

export default function CompleteRegistrationComponent({ email }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    payrollNo: "",
    department: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

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
          payrollNo: formData.payrollNo,
          department: formData.department,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      let dashboardPath;
      if (data.role === "payroll") dashboardPath = "/payrolldashboard";
      else if (data.role === "hr") dashboardPath = "/hrdashboard";
      else if (data.role === "cc") dashboardPath = "/ccdashboard";
      else if (data.role === "bi") dashboardPath = "/bidashboard";
      else if (data.role === "staff") dashboardPath = "/staffdashboard";
      else dashboardPath = "/login";

      router.push(dashboardPath);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
      {showAlert && (
        <Alert
          message="Your email has been verified successfully"
          type="success"
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-4 shadow-lg dark:border-gray-800 dark:bg-gray-950">
        <div className="w-full max-w-sm space-y-4">
          {/* Title Section */}
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Complete Registration
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please provide your details to finalize your account.
            </p>
          </div>

          {/* Global Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="space-y-2"
            autoComplete="off"
          >
            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                // Standard Input Style
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
              />
            </div>

            {/* Payroll Number */}
            <div className="space-y-2">
              <label
                htmlFor="payrollNo"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Payroll Number
              </label>
              <input
                type="text"
                name="payrollNo"
                id="payrollNo"
                value={formData.payrollNo}
                onChange={handleChange}
                required
                placeholder="12345"
                // Standard Input Style
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
              />
            </div>

            {/* Department (Select Field) */}
            <div className="space-y-2">
              <label
                htmlFor="department"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Department
              </label>
              <select
                name="department"
                id="department"
                value={formData.department}
                onChange={handleChange}
                required
                // Standard Select Style (matching input field)
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-600 dark:focus:ring-gray-600"
              >
                <option value="" disabled>
                  Select a department
                </option>
                <option value="Commercial">Commercial</option>
                <option value="Finance">Finance</option>
                <option value="HR & Admin">HR & Admin</option>
                <option value="Directorate">Directorate</option>
                <option value="Marketing">Marketing</option>
                <option value="B2B">B2B</option>
                <option value="IT & Projects">IT & Projects</option>
                <option value="Operations">Operations</option>
                <option value="Modern Trade">Modern Trade</option>
                <option value="Retail">Retail</option>
                <option value="Engineering & HVAC">Engineering & HVAC</option>
                <option value="Service Center">Service Center</option>
                <option value="Internal Audit">Internal Audit</option>
                <option value="Security">Security</option>
              </select>
              {/* Custom arrow for select - often added here if appearance-none is used */}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                  placeholder="••••••••"
                  // Standard Input Style
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                // Standard Input Style
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
              />
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  // Standard Error Text Style
                  <p className="ml-0 text-xs text-red-600 dark:text-red-500">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading ||
                (formData.confirmPassword &&
                  formData.password !== formData.confirmPassword)
              }
              // Standard Button Style
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-gray-600"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-900 dark:border-t-transparent"></div>
                  Completing...
                </span>
              ) : (
                "Complete"
              )}
            </button>
          </form>

          {/* Register Page */}
          <div className="flex items-center justify-center">
            <Link
              href="/register"
              className="text-center text-xs text-gray-500 hover:underline dark:text-gray-500"
            >
              back to register page
            </Link>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
}
