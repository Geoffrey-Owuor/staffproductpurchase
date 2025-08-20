"use client";

import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-red-800">
          Complete Registration
        </h1>

        {error && <div className="mb-4 text-center text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div className="text-center text-green-600">
            Email verified successfully!
          </div>

          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-transparent focus:border-blue-600 focus:outline-none"
            />
            <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600">
              Full Name
            </label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder=" "
              minLength="8"
              className="peer w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-transparent focus:border-blue-600 focus:outline-none"
            />
            <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600">
              Password
            </label>
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-transparent focus:border-blue-600 focus:outline-none"
            />
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  Passwords do not match
                </p>
              )}
            <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-blue-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600">
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
            className={`w-full cursor-pointer rounded-xl px-4 py-3 font-medium text-white transition duration-200 ${
              loading ||
              (formData.confirmPassword &&
                formData.password !== formData.confirmPassword)
                ? "cursor-not-allowed bg-red-400"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  Completing...
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                </div>
              </>
            ) : (
              <>Complete</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
