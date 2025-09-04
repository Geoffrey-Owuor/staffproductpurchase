import { formatDateLong } from "@/public/assets";

export default function BIApprovalSection({
  formData,
  handleChange,
  userRole,
}) {
  const isReadOnly = userRole != "bi";
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      {/* Invoicing Details Section */}
      <div className="border-b-gray-200">
        <div className="px-6 py-3">
          <h3 className="text-lg font-medium text-red-900">
            Invoicing Details
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="invoice_date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Date of Invoice
            </label>
            <input
              type="date"
              id="invoice_date"
              name="invoice_date"
              value={formData.invoice_date}
              onChange={handleChange}
              readOnly={isReadOnly}
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
              required
            />
          </div>

          <div>
            <label
              htmlFor="invoice_number"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Invoice No
            </label>
            <input
              type="text"
              id="invoice_number"
              name="invoice_number"
              value={formData.invoice_number}
              onChange={handleChange}
              readOnly={isReadOnly}
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
              placeholder="Enter invoice number"
              required
            />
          </div>

          <div>
            <label
              htmlFor="invoice_amount"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Amount (Ksh)
            </label>
            <input
              type="number"
              id="invoice_amount"
              name="invoice_amount"
              value={formData.invoice_amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              readOnly={isReadOnly}
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
              placeholder="Enter invoice amount"
              required
            />
          </div>

          <div>
            <label
              htmlFor="invoice_recorded_date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Date Recorded
            </label>
            <input
              type="date"
              id="invoice_recorded_date"
              name="invoice_recorded_date"
              value={formData.invoice_recorded_date}
              onChange={handleChange}
              readOnly={isReadOnly}
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Received Section */}
      <div>
        <div className="px-6 py-3">
          <h3 className="text-lg font-medium text-red-900">Payment Received</h3>
        </div>
        <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="payment_method"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Payment Method
            </label>
            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              disabled={isReadOnly}
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
            >
              <option value="" disabled>
                Select method
              </option>
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="card">Card</option>
              <option value="credit">Credit</option>
              <option value="mobile">Mobile Money</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="payment_reference"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Reference Details
            </label>
            <input
              type="text"
              id="payment_reference"
              name="payment_reference"
              value={formData.payment_reference}
              onChange={handleChange}
              readOnly={isReadOnly}
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
              placeholder="Enter reference details"
            />
          </div>

          <div>
            <label
              htmlFor="payment_date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Payment Date
            </label>
            <input
              type="date"
              id="payment_date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              readOnly={isReadOnly}
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Amount (Ksh)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              readOnly={isReadOnly}
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
              placeholder="Enter amount received"
            />
          </div>
          <div>
            <label
              htmlFor="bi_approval"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              BI Approval
            </label>
            <select
              id="bi_approval"
              name="bi_approval"
              value={formData.bi_approval}
              onChange={handleChange}
              disabled={isReadOnly}
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
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
              htmlFor="bi_approver_name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Invoiced By
            </label>
            <input
              type="text"
              id="bi_approver_name"
              name="bi_approver_name"
              value={formData.bi_approver_name}
              onChange={handleChange}
              readOnly={isReadOnly}
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none ${isReadOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
              placeholder="Enter invoicer name"
            />
          </div>
          <div>
            <label
              htmlFor="bi_approval_date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Bi Approval Date
            </label>
            <input
              type="text"
              id="bi_approval_date"
              name="bi_approval_date"
              value={formatDateLong(formData.bi_approval_date)}
              onChange={handleChange}
              readOnly
              className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
