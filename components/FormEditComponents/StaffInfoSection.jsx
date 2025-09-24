import FormAsterisk from "../Reusables/FormAsterisk/FormAsterisk";

export default function StaffInfoSection({ formData, handleChange, userRole }) {
  const isReadOnly = userRole != "staff";
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Staff Information
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-3 dark:bg-gray-950">
        <div>
          <label
            htmlFor="staffName"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Staff Name <FormAsterisk />
          </label>
          <input
            type="text"
            id="staffName"
            name="staffName"
            value={formData.staffName}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter staff name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="payrollNo"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Payroll No <FormAsterisk />
          </label>
          <input
            type="text"
            id="payrollNo"
            name="payrollNo"
            value={formData.payrollNo}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter payroll number"
            required
          />
        </div>
        <div>
          <label
            htmlFor="department"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Department <FormAsterisk />
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter payroll number"
            required
          />
        </div>
      </div>
    </div>
  );
}
