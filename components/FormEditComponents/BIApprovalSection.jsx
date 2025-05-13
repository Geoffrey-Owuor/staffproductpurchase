export default function BIApprovalSection({ formData, handleChange }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-red-200 shadow">
      {/* Invoicing Details Section */}
      <div className="border-b border-red-200">
        <div className="bg-red-900 px-6 py-3 text-white">
          <h3 className="text-lg font-medium">Invoicing Details</h3>
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Enter invoice number"
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Enter invoice amount"
            />
          </div>

          <div>
            <label
              htmlFor="bi_signature"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Invoiced By
            </label>
            <input
              type="text"
              id="bi_signature"
              name="bi_signature"
              value={formData.bi_signature}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Enter invoicer name"
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Payment Received Section */}
      <div>
        <div className="bg-red-900 px-6 py-3 text-white">
          <h3 className="text-lg font-medium">Payment Received</h3>
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="">Select method</option>
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="card">Card</option>
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Enter amount received"
            />
          </div>
          <div>
            <label
              htmlFor="BI_Approval"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              BI Approval
            </label>
            <select
              id="BI_Approval"
              name="BI_Approval"
              value={formData.BI_Approval}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="">Select status</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
