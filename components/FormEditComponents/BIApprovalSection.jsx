import { formatDateLong } from "@/public/assets";
import FormAsterisk from "../Reusables/FormAsterisk/FormAsterisk";

export default function BIApprovalSection({
  formData,
  handleChange,
  userRole,
}) {
  const isReadOnly = userRole !== "bi";
  return (
    <div className="bg-gradient-classes overflow-hidden rounded-xl">
      {/* Invoicing Details Section */}

      <div className="px-2 py-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Invoicing Details
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-6 px-2 py-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label
            htmlFor="invoice_date"
            className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-400"
          >
            Date of Invoice <FormAsterisk />
          </label>
          <input
            type="date"
            id="invoice_date"
            name="invoice_date"
            value={formData.invoice_date}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            required
          />
        </div>

        <div>
          <label
            htmlFor="invoice_number"
            className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-400"
          >
            Invoice No <FormAsterisk />
          </label>
          <input
            type="text"
            id="invoice_number"
            name="invoice_number"
            value={formData.invoice_number}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            placeholder="Enter invoice number"
            required
          />
        </div>

        <div>
          <label
            htmlFor="invoice_amount"
            className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-400"
          >
            Invoice Amount (Ksh) <FormAsterisk />
          </label>
          <input
            type="number"
            id="invoice_amount"
            name="invoice_amount"
            value={formData.invoice_amount}
            onChange={handleChange}
            readOnly={isReadOnly}
            step="0.01"
            min="0"
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            placeholder="Enter invoice amount"
            required
          />
        </div>

        <div>
          <label
            htmlFor="BI_Approval"
            className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-400"
          >
            Invoicing Approval <FormAsterisk />
          </label>
          <select
            id="BI_Approval"
            name="BI_Approval"
            value={formData.BI_Approval}
            onChange={handleChange}
            disabled={isReadOnly}
            required
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="bi_approver_name"
            className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-400"
          >
            Invoiced By <FormAsterisk />
          </label>
          <input
            type="text"
            id="bi_approver_name"
            name="bi_approver_name"
            value={formData.bi_approver_name}
            onChange={handleChange}
            readOnly={isReadOnly}
            required
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            placeholder="Enter invoicer name"
          />
        </div>
        <div>
          <label
            htmlFor="bi_approval_date"
            className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-400"
          >
            Invoicing Approval Date
          </label>
          <input
            type="text"
            id="bi_approval_date"
            name="bi_approval_date"
            value={formatDateLong(formData.bi_approval_date)}
            onChange={handleChange}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>

        <div className="md:col-span-3">
          <label
            htmlFor="payment_reference"
            className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-400"
          >
            Reference Details <FormAsterisk />
          </label>
          <textarea
            id="payment_reference"
            name="payment_reference"
            value={formData.payment_reference || ""}
            onChange={handleChange}
            rows="3" //Text Area Height
            className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            required
            disabled={isReadOnly}
            placeholder="Enter reference details"
          />
        </div>
      </div>
    </div>
  );
}
