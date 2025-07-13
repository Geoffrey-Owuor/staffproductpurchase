const StaffInformation = ({ formData, handleChange }) => {
  return (
    <div className="mb-8 rounded-xl border border-red-200 bg-white">
      <div className="rounded-t-xl bg-red-900 px-6 py-3 text-lg font-bold text-white">
        STAFF INFORMATION
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="staffname"
              className="mb-2 block font-medium text-red-900"
            >
              Staff Name
            </label>
            <input
              type="text"
              id="staffname"
              name="staffname"
              value={formData.staffname}
              onChange={handleChange}
              className="w-full rounded-xl border border-red-200 p-3 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="payrollno"
              className="mb-2 block font-medium text-red-900"
            >
              Payroll No
            </label>
            <input
              type="text"
              id="payrollno"
              name="payrollno"
              value={formData.payrollno}
              onChange={handleChange}
              className="w-full rounded-xl border border-red-200 p-3 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="mb-2 block font-medium text-red-900"
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full rounded-xl border border-red-200 p-3 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffInformation;
