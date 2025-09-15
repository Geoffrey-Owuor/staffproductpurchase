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
            htmlFor="staffname"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Staff Name
          </label>
          <input
            type="text"
            id="staffname"
            name="staffname"
            value={formData.staffname}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter staff name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="payrollno"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Payroll No
          </label>
          <input
            type="text"
            id="payrollno"
            name="payrollno"
            value={formData.payrollno}
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
            Department
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            required
          >
            <option value="" disabled>
              Select a department
            </option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="HR & Admin">HR & Admin</option>
            <option value="IT & Projects">IT & Projects</option>
            <option value="Finance">Finance</option>
            <option value="Retail">Retail</option>
            <option value="B2B">B2B</option>
            <option value="Service Center">Service Center</option>
            <option value="Modern Trade">Modern Trade</option>
            <option value="Commercial">Commercial</option>
            <option value="Imports & Exports">Imports & Exports</option>
            <option value="Warehouse">Warehouse</option>
          </select>
        </div>
      </div>
    </div>
  );
}
