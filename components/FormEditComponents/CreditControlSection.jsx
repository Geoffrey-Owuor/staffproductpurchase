export default function CreditControlSection({ formData, handleChange }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-red-200 shadow">
      <div className="bg-red-900 px-6 py-3 text-white">
        <h3 className="text-lg font-medium">
          Credit Control Verification and Approval
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2">
        {/* Full-width text fields */}
        <div className="md:col-span-2">
          <label
            htmlFor="credit_period"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Credit Period Given & Mode of Payments
          </label>
          <textarea
            id="credit_period"
            name="credit_period"
            rows={3}
            value={formData.credit_period}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
            placeholder="Enter credit period assessment (1-3 paragraphs)"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="one_third_rule"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            1/3 Rule Assessment
          </label>
          <textarea
            id="one_third_rule"
            name="one_third_rule"
            rows={3}
            value={formData.one_third_rule}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
            placeholder="Enter 1/3 rule compliance assessment"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="purchase_history_comments"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Purchase History Comments
          </label>
          <textarea
            id="purchase_history_comments"
            name="purchase_history_comments"
            rows={3}
            value={formData.purchase_history_comments}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
            placeholder="Enter comments on purchase history"
          />
        </div>

        {/* Two-column fields */}
        <div>
          <label
            htmlFor="pending_invoices"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Pending Invoices/Outstanding Amounts
          </label>
          <input
            type="text"
            id="pending_invoices"
            name="pending_invoices"
            value={formData.pending_invoices}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
            placeholder="Enter pending invoices details"
          />
        </div>

        <div>
          <label
            htmlFor="cc_approval"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Approval Status
          </label>
          <select
            id="cc_approval"
            name="cc_approval"
            value={formData.cc_approval}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">Select status</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="cc_signature"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Checked By
          </label>
          <input
            type="text"
            id="cc_signature"
            name="cc_signature"
            value={formData.cc_signature}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
            placeholder="Enter verifier's name"
          />
        </div>

        <div>
          <label
            htmlFor="cc_approval_date"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Approval Date
          </label>
          <input
            type="date"
            id="cc_approval_date"
            name="cc_approval_date"
            value={formData.cc_approval_date}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>
      </div>
    </div>
  );
}
