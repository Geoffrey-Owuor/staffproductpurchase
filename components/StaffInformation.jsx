import FormAsterisk from "./Reusables/FormAsterisk/FormAsterisk";

const StaffInformation = ({ formData, handleChange, userRole }) => {
  const isReadOnly = userRole !== "staff";
  return (
    <div className="bg-gradient-classes rounded-xl">
      <div className="rounded-t-xl px-2 py-3 text-lg font-semibold text-gray-900 dark:text-white">
        Staff Information
      </div>
      <div className="px-2 py-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="staffName"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400"
            >
              Staff Name <FormAsterisk />
            </label>
            <input
              type="text"
              id="staffName"
              name="staffName"
              value={formData.staffName}
              onChange={handleChange}
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
              required
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label
              htmlFor="payrollNo"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400"
            >
              Payroll No <FormAsterisk />
            </label>
            <input
              type="text"
              id="payrollNo"
              name="payrollNo"
              value={formData.payrollNo}
              onChange={handleChange}
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
              required
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400"
            >
              Department <FormAsterisk />
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
              required
              readOnly={isReadOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffInformation;
