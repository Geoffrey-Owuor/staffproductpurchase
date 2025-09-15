import { formatDateLong } from "@/public/assets";

export default function CreditControlSection({
  formData,
  handleChange,
  userRole,
}) {
  const isReadOnly = userRole != "cc";
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Credit Control Verification and Approval
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2 dark:bg-gray-950">
        {/* Full-width text fields */}
        <div className="md:col-span-2">
          <label
            htmlFor="credit_period"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Credit Period Given & Mode of Payments
          </label>
          <textarea
            id="credit_period"
            name="credit_period"
            rows={3}
            value={formData.credit_period}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter credit period assessment (1-3 paragraphs)"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="one_third_rule"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            1/3 Rule Assessment
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

        <div className="md:col-span-2">
          <label
            htmlFor="purchase_history_comments"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Purchase History Comments
          </label>
          <textarea
            id="purchase_history_comments"
            name="purchase_history_comments"
            rows={3}
            value={formData.purchase_history_comments}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter comments on purchase history"
            required
          />
        </div>

        {/* Two-column fields */}
        <div>
          <label
            htmlFor="pending_invoices"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Pending Invoices/Outstanding Amounts
          </label>
          <input
            type="text"
            id="pending_invoices"
            name="pending_invoices"
            value={formData.pending_invoices}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter pending invoices details"
            required
          />
        </div>

        <div>
          <label
            htmlFor="CC_Approval"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Approval Status
          </label>
          <select
            id="CC_Approval"
            name="CC_Approval"
            value={formData.CC_Approval}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            required
          >
            <option value="pending" disabled>
              Pending
            </option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="cc_signature"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Checked By
          </label>
          <input
            type="text"
            id="cc_approver_name"
            name="cc_approver_name"
            value={formData.cc_approver_name}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter verifier's name"
            required
          />
        </div>

        <div>
          <label
            htmlFor="cc_approval_date"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            CC Approval Date
          </label>
          <input
            type="text"
            id="cc_approval_date"
            name="cc_approval_date"
            value={formatDateLong(formData.cc_approval_date)}
            onChange={handleChange}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}
