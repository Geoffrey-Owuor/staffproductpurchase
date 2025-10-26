import FormAsterisk from "../Reusables/FormAsterisk/FormAsterisk";
import { formatDateLong } from "@/public/assets";

export default function PayrollApprovalSection({
  formData,
  userRole,
  handleChange,
}) {
  const isReadOnly = userRole !== "payroll";
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Payroll Approval
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2 dark:bg-gray-950">
        {/* Third Rule Assessment */}
        <div className="md:col-span-2">
          <label
            htmlFor="one_third_rule"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            1/3 Rule Assessment <FormAsterisk />
          </label>
          <textarea
            id="one_third_rule"
            name="one_third_rule"
            rows={3}
            value={formData.one_third_rule}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter 1/3 rule compliance assessment"
            required
          />
        </div>

        {/* Payroll Approver Name */}
        <div>
          <label
            htmlFor="payroll_approver_name"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Payroll Approver Name <FormAsterisk />
          </label>
          <input
            type="text"
            id="payroll_approver_name"
            name="payroll_approver_name"
            value={formData.payroll_approver_name}
            onChange={handleChange}
            readOnly={isReadOnly}
            required
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            placeholder="Enter Payroll approver name"
          />
        </div>

        {/* Approval Status */}
        <div>
          <label
            htmlFor="Payroll_Approval"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Approval Status <FormAsterisk />
          </label>
          <select
            id="Payroll_Approval"
            name="Payroll_Approval"
            value={formData.Payroll_Approval}
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

        {/* Approval Date */}
        <div>
          <label
            htmlFor="payroll_approval_date"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Payroll Approval Date
          </label>
          <input
            type="text"
            id="payroll_approval_date"
            name="payroll_approval_date"
            value={formatDateLong(formData.payroll_approval_date)}
            onChange={handleChange}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}
