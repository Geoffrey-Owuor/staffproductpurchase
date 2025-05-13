const ProductPricing = ({ formData, handleChange }) => {
  return (
    <div className="mb-8 rounded-2xl border border-red-200 bg-white shadow-md">
      <div className="rounded-t-2xl bg-red-900 px-6 py-3 text-lg font-bold text-white">
        PRODUCT & PRICING DETAILS
      </div>
      <div className="overflow-x-auto p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-50">
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                Item Name
              </th>
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                Status (New/RHD2)
              </th>
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                Product Code
              </th>
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                TD Price
              </th>
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                Discount Rate
              </th>
              <th className="border border-red-200 p-3 text-left font-medium text-red-900">
                Discounted Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-red-200 p-2">
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  required
                />
              </td>
              <td className="border border-red-200 p-2">
                <select
                  name="itemStatus"
                  value={formData.itemStatus}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  required
                >
                  <option value="">Select</option>
                  <option value="New">New</option>
                  <option value="RHD2">RHD2</option>
                </select>
              </td>
              <td className="border border-red-200 p-2">
                <input
                  type="text"
                  name="productCode"
                  value={formData.productCode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </td>
              <td className="border border-red-200 p-2">
                <input
                  type="number"
                  step="0.01"
                  name="tdPrice"
                  value={formData.tdPrice}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </td>
              <td className="border border-red-200 p-2">
                <input
                  type="number"
                  step="0.01"
                  name="discountRate"
                  value={formData.discountRate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-red-200 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </td>
              <td className="border border-red-200 p-2">
                <input
                  type="number"
                  step="0.01"
                  name="discountedValue"
                  value={formData.discountedValue}
                  readOnly
                  className="w-full rounded-xl border border-red-200 bg-gray-100 p-2 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="date"
              className="mb-2 block font-medium text-red-900"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-red-200 p-3 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              required
            />
          </div>
          <div>
            <label
              htmlFor="signature"
              className="mb-2 block font-medium text-red-900"
            >
              Signature
            </label>
            <input
              type="text"
              id="signature"
              name="signature"
              value={formData.signature}
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

export default ProductPricing;
