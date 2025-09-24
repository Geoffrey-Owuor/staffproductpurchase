"use client";
import { useUser } from "@/context/UserContext";
export default function GeneralSettingsPage() {
  const { name, department, payrollNo, role } = useUser();
  const roleDisplayMap = {
    hr: "HR & Admin",
    cc: "Credit Control",
    bi: "Billing & Invoice",
    staff: "Staff",
  };

  const longerRole =
    roleDisplayMap[role] || role.charAt(0).toUpperCase() + role.slice(1);

  const fields = [
    { label: "User Name", value: name },
    { label: "Department", value: department },
    { label: "Payroll Number", value: payrollNo },
    { label: "Role", value: longerRole },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        User Information
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <div className="mt-1 rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
