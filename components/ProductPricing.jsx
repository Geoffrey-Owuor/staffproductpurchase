import { useEffect } from "react";

const discountPolicy = {
  "Von Hotpoint on Account": { New: 10, RHD2: 15 },
  "Von Hotpoint on Cash Payment": { New: 12.5, RHD2: 17.5 },
  "Non Von Hotpoint on Cash Payment": { New: 10, RHD2: 15 },
  "Non Von Hotpoint on Account": { New: 7.5, RHD2: 12.5 },
  "Samsung Brand on Cash payment": { New: 5, RHD2: 7.5 },
  "Samsung Brand on Account": { New: 2.5, RHD2: 5 },
};

const ProductPricing = ({ formData, handleChange, setFormData }) => {
  // Auto-calculate discountRate when itemStatus or productPolicy changes
  useEffect(() => {
    const { itemStatus, productPolicy } = formData;
    if (itemStatus && productPolicy && discountPolicy[productPolicy]) {
      const rate = discountPolicy[productPolicy][itemStatus];
      if (rate !== undefined) {
        setFormData((prev) => ({
          ...prev,
          discountRate: rate,
        }));
      }
    }
  }, [formData.itemStatus, formData.productPolicy]);

  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
      <div className="rounded-t-xl px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
        Product & Pricing Details
      </div>
      <div className="overflow-x-auto px-6 py-4">
        {/* Item Name Field Full Width */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Item Name
          </label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            required
          />
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="border border-gray-200 p-2 text-left text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
                Status (New/RHD2)
              </th>
              <th className="border border-gray-200 p-2 text-left text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
                Item Policy Type
              </th>
              <th className="border border-gray-200 p-2 text-left text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
                Product Code
              </th>
              <th className="border border-gray-200 p-2 text-left text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
                TD Price
              </th>
              <th className="border border-gray-200 p-2 text-left text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
                Discount Rate
              </th>
              <th className="border border-gray-200 p-2 text-left text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
                Discounted Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* Status */}
              <td className="border border-gray-200 p-2 dark:border-gray-700">
                <select
                  name="itemStatus"
                  value={formData.itemStatus}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  required
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="New">New</option>
                  <option value="RHD2">RHD2</option>
                </select>
              </td>

              {/* Product Policy Type */}
              <td className="border border-gray-200 p-2 dark:border-gray-700">
                <select
                  name="productPolicy"
                  value={formData.productPolicy || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                >
                  <option value="" disabled>
                    Select Policy
                  </option>
                  {Object.keys(discountPolicy).map((policy) => (
                    <option key={policy} value={policy}>
                      {policy}
                    </option>
                  ))}
                </select>
              </td>

              {/* Product Code */}
              <td className="border border-gray-200 p-2 dark:border-gray-700">
                <input
                  type="text"
                  name="productCode"
                  value={formData.productCode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </td>

              {/* TD Price */}
              <td className="border border-gray-200 p-2 dark:border-gray-700">
                <input
                  type="number"
                  step="0.01"
                  name="tdPrice"
                  value={formData.tdPrice}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </td>

              {/* Discount Rate - ReadOnly */}
              <td className="border border-gray-200 p-2 dark:border-gray-700">
                <input
                  type="number"
                  step="0.01"
                  name="discountRate"
                  value={formData.discountRate}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </td>

              {/* Discounted Value - ReadOnly */}
              <td className="border border-gray-200 p-2 dark:border-gray-700">
                <input
                  type="number"
                  step="0.01"
                  name="discountedValue"
                  value={formData.discountedValue}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Payment Terms */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="employee_payment_terms"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Payment Terms/Options
            </label>
            <select
              id="employee_payment_terms"
              name="employee_payment_terms"
              value={formData.employee_payment_terms}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              required
            >
              <option value="" disabled>
                Select a payment option
              </option>
              <option value="CREDIT">Credit</option>
              <option value="CASH">Cash</option>
              <option value="BANK">Bank</option>
              <option value="MPESA">Mpesa</option>
            </select>
          </div>

          {/* Conditional field to appear when user selects the credit option in payment terms/options */}
          {formData.employee_payment_terms === "CREDIT" && (
            <div>
              <label
                htmlFor="user_credit_period"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Credit Period
              </label>
              <select
                id="user_credit_period"
                name="user_credit_period"
                value={formData.user_credit_period || ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                required
              >
                <option value="" disabled>
                  Select period
                </option>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPricing;
