export default function StaffInfoSection({ formData, handleChange }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-red-200 shadow">
      <div className="bg-red-900 px-6 py-3 text-white">
        <h3 className="text-lg font-medium">Staff Information</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-3">
        <div>
          <label
            htmlFor="staffname"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Staff Name
          </label>
          <input
            type="text"
            id="staffname"
            name="staffname"
            value={formData.staffname}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label
            htmlFor="payrollno"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Payroll No
          </label>
          <input
            type="text"
            id="payrollno"
            name="payrollno"
            value={formData.payrollno}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label
            htmlFor="department"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
        </div>
      </div>
    </div>
  );
}
