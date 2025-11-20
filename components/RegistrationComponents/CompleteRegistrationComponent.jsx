"use client";

import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
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
      <div className="rounded-xl border border-gray-300 bg-white px-8 py-6 shadow-lg dark:border-gray-700 dark:bg-gray-950">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          Complete Registration
        </h1>
        {error && (
          <div className="mb-4 text-center text-sm text-red-700">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
            />
            <label className="absolute -top-3 left-4 rounded-md bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300">
              Full Name
            </label>
          </div>
          {/* Payroll Number */}
          <div className="relative">
            <input
              type="text"
              name="payrollNo"
              value={formData.payrollNo}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
            />
            <label className="absolute -top-3 left-4 rounded-md bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300">
              Payroll Number
            </label>
          </div>
          {/* Department */}
          <div className="relative">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="peer w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 focus:ring-0 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="" disabled>
                Select a department
              </option>
              <option value="Commercial">Commercial</option>
              <option value="Finance">Finance</option>
              <option value="HR & Admin">HR & Admin</option>
              <option value="Marketing">Marketing</option>
              <option value="B2B">B2B</option>
              <option value="IT & Projects">IT & Projects</option>
              <option value="Imports & Exports">Imports & Exports</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Modern Trade">Modern Trade</option>
              <option value="Retail">Retail</option>
              <option value="Service Center">Service Center</option>
              <option value="Engineering & HVAC">Engineering & HVAC</option>
            </select>
            <label className="absolute -top-3 left-4 rounded-md bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300">
              Department
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
              className="peer w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
            />
            <label className="absolute -top-3 left-4 rounded-md bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300">
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
              className="peer w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2 placeholder-transparent focus:outline-none dark:border-gray-700 dark:text-white"
            />
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="mt-1 ml-2 text-sm text-red-600">
                  passwords do not match
                </p>
              )}
            <label className="absolute -top-3 left-4 rounded-md bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-600 dark:bg-gray-950 dark:text-gray-400 peer-focus:dark:text-gray-300">
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
            className={`w-full rounded-xl px-4 py-2 font-medium transition duration-200 ${
              loading ||
              (formData.confirmPassword &&
                formData.password !== formData.confirmPassword)
                ? "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                Completing...
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-t-transparent"></div>
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
    </AuthBackground>
  );
}
