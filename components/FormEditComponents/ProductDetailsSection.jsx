export default function ProductDetailsSection({ formData, handleChange }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-red-200 shadow">
      <div className="bg-red-900 px-6 py-3 text-white">
        <h3 className="text-lg font-medium">Product and Pricing Details</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="itemname"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Item Name
          </label>
          <input
            type="text"
            id="itemname"
            name="itemname"
            value={formData.itemname}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="itemstatus"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="itemstatus"
            name="itemstatus"
            value={formData.itemstatus}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          >
            <option value="">Select status</option>
            <option value="New">New</option>
            <option value="RHD2">RHD2</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="productcode"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Product Code
          </label>
          <input
            type="text"
            id="productcode"
            name="productcode"
            value={formData.productcode}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="tdprice"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            TD Price (Ksh)
          </label>
          <input
            type="number"
            id="tdprice"
            name="tdprice"
            value={formData.tdprice}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="discountrate"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Discount Rate (%)
          </label>
          <input
            type="number"
            id="discountrate"
            name="discountrate"
            value={formData.discountrate}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="100"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="discountedvalue"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Discounted Value (Ksh)
          </label>
          <input
            type="number"
            id="discountedvalue"
            name="discountedvalue"
            value={formData.discountedvalue}
            step="0.01"
            min="0"
            readOnly
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="createdat"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="createdat"
            id="createdat"
            name="createdat"
            value={formData.createdat}
            onChange={handleChange}
            readOnly
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="employee_payment_terms"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Payment Terms/Options
          </label>
          <select
            id="employee_payment_terms"
            name="employee_payment_terms"
            value={formData.employee_payment_terms}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          >
            <option value="">No payment option selected</option>
            <option value="CREDIT">Credit</option>
            <option value="CASH">Cash</option>
            <option value="BANK">Bank</option>
            <option value="MPESA">Mpesa</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="signature"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Signature
          </label>
          <input
            type="text"
            id="signature"
            name="signature"
            value={formData.signature}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
        </div>
      </div>
    </div>
  );
}
