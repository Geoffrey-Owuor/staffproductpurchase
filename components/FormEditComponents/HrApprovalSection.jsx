import { formatDateLong } from "@/public/assets";

export default function HRApprovalSection({
  formData,
  handleChange,
  userRole,
}) {
  const isReadOnly = userRole !== "hr";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          HR/Payroll Approval
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2 dark:bg-gray-950">
        {/* Employment Status */}
        <div>
          <label
            htmlFor="is_employed"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Employment Status
          </label>
          <select
            id="is_employed"
            name="is_employed"
            value={formData.is_employed}
            onChange={handleChange}
            disabled={isReadOnly}
            required
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
          >
            <option value="" disabled>
              Select status
            </option>
            <option value="contract">Contract</option>
            <option value="permanent">Permanent</option>
          </select>
        </div>

        {/* Probation */}
        <div>
          <label
            htmlFor="on_probation"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Probation?
          </label>
          <select
            id="on_probation"
            name="on_probation"
            value={formData.on_probation}
            onChange={handleChange}
            disabled={isReadOnly}
            required
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
          >
            <option value="" disabled>
              Select status
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Approval Status */}
        <div>
          <label
            htmlFor="hr_approval"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Approval Status
          </label>
          <select
            id="hr_approval"
            name="hr_approval"
            value={formData.hr_approval}
            onChange={handleChange}
            disabled={isReadOnly}
            required
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
          >
            <option value="pending" disabled>
              Pending
            </option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        {/* Approver Name */}
        <div>
          <label
            htmlFor="hr_approver_name"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            HR Approver Name
          </label>
          <input
            type="text"
            id="hr_approver_name"
            name="hr_approver_name"
            value={formData.hr_approver_name}
            onChange={handleChange}
            readOnly={isReadOnly}
            required
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            placeholder="Enter HR approver name"
          />
        </div>

        {/* Approval Date */}
        <div>
          <label
            htmlFor="hr_approval_date"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            HR Approval Date
          </label>
          <input
            type="text"
            id="hr_approval_date"
            name="hr_approval_date"
            value={formatDateLong(formData.hr_approval_date)}
            onChange={handleChange}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>

        {/* Comments */}
        <div className="md:col-span-2">
          <label
            htmlFor="hr_comments"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            HR Comments
          </label>
          <textarea
            id="hr_comments"
            name="hr_comments"
            rows={3}
            value={formData.hr_comments}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            placeholder="Enter HR comments"
          />
        </div>
      </div>
    </div>
  );
}
