export default function ProductDetailsSection({ formData, handleChange }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-red-200 shadow">
      <div className="bg-red-900 px-6 py-3 text-white">
        <h3 className="text-lg font-medium">Product and Pricing Details</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="itemName"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Item Name
          </label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="itemStatus"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="itemStatus"
            name="itemStatus"
            value={formData.itemStatus}
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
            htmlFor="productCode"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Product Code
          </label>
          <input
            type="text"
            id="productCode"
            name="productCode"
            value={formData.productCode}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="tdPrice"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            TD Price (Ksh)
          </label>
          <input
            type="number"
            id="tdPrice"
            name="tdPrice"
            value={formData.tdPrice}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="discountRate"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Discount Rate (%)
          </label>
          <input
            type="number"
            id="discountRate"
            name="discountRate"
            value={formData.discountRate}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="100"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="discountedValue"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Discounted Value (Ksh)
          </label>
          <input
            type="number"
            id="discountedValue"
            name="discountedValue"
            value={formData.discountedValue}
            step="0.01"
            min="0"
            readOnly
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            required
          />
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
