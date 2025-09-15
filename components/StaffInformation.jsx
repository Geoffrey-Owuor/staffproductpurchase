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
              htmlFor="staffname"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Staff Name
            </label>
            <input
              type="text"
              id="staffname"
              name="staffname"
              value={formData.staffname}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="payrollno"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Payroll No
            </label>
            <input
              type="text"
              id="payrollno"
              name="payrollno"
              value={formData.payrollno}
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
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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
    </div>
  );
};

export default StaffInformation;
