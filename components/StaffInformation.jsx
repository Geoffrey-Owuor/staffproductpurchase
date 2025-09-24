import FormAsterisk from "./Reusables/FormAsterisk/FormAsterisk";

const StaffInformation = ({ formData, handleChange }) => {
  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
      <div className="rounded-t-xl px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
        Staff Information
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="staffName"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Staff Name <FormAsterisk />
            </label>
            <input
              type="text"
              id="staffName"
              name="staffName"
              value={formData.staffName}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="payrollNo"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Payroll No <FormAsterisk />
            </label>
            <input
              type="text"
              id="payrollNo"
              name="payrollNo"
              value={formData.payrollNo}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Department <FormAsterisk />
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffInformation;
