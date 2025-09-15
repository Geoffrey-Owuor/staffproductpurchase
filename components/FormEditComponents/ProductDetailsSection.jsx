import { formatDateLong } from "@/public/assets";
import { useEffect } from "react";

const discountPolicy = {
  "Von Hotpoint on Account": { New: 10, RHD2: 15 },
  "Von Hotpoint on Cash Payment": { New: 12.5, RHD2: 17.5 },
  "Non Von Hotpoint on Cash Payment": { New: 10, RHD2: 15 },
  "Non Von Hotpoint on Account": { New: 7.5, RHD2: 12.5 },
  "Samsung Brand on Cash payment": { New: 5, RHD2: 7.5 },
  "Samsung Brand on Account": { New: 2.5, RHD2: 5 },
};

export default function ProductDetailsSection({
  formData,
  handleChange,
  userRole,
  setFormData,
}) {
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

  const isReadOnly = userRole != "staff";
  const ccReadOnly = userRole != "cc";
  const isRequired = userRole === "cc";
  const editableRoles = ["cc", "staff"];
  const isReadOnlyGeneral = !editableRoles.includes(userRole);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Product and Pricing Details
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2 dark:bg-gray-950">
        <div className="md:col-span-2">
          <label
            htmlFor="itemName"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Item Name
          </label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            readOnly={isReadOnlyGeneral}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnlyGeneral ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter item name"
            required
          />
        </div>

        <div>
          <label
            htmlFor="productPolicy"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Item Policy
          </label>
          <select
            id="productPolicy"
            name="productPolicy"
            value={formData.productPolicy}
            onChange={handleChange}
            disabled={isReadOnlyGeneral}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${formData.itemStatus === "" ? "text-gray-400" : "text-black"} ${isReadOnlyGeneral ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            required
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
        </div>

        <div>
          <label
            htmlFor="itemStatus"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Status
          </label>
          <select
            id="itemStatus"
            name="itemStatus"
            value={formData.itemStatus}
            onChange={handleChange}
            disabled={isReadOnlyGeneral}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnlyGeneral ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            required
          >
            <option value="" disabled>
              Select status
            </option>
            <option value="New">New</option>
            <option value="RHD2">RHD2</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="productCode"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Product Code
          </label>
          <input
            type="text"
            id="productCode"
            name="productCode"
            value={formData.productCode}
            onChange={handleChange}
            readOnly={isReadOnlyGeneral}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnlyGeneral ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter product code"
            required={isRequired}
          />
        </div>

        <div>
          <label
            htmlFor="tdPrice"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            TD Price (Ksh)
          </label>
          <input
            type="number"
            id="tdPrice"
            name="tdPrice"
            value={formData.tdPrice}
            onChange={handleChange}
            readOnly={isReadOnlyGeneral}
            step="0.01"
            min="0"
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnlyGeneral ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter TD price"
            required={isRequired}
          />
        </div>

        <div>
          <label
            htmlFor="discountRate"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
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
            readOnly={ccReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-500 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-gray-400 ${ccReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            placeholder="Enter discount rate"
            required={isRequired}
          />
        </div>

        <div>
          <label
            htmlFor="discountedValue"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
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
            className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>

        <div>
          <label
            htmlFor="createdAt"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Date Submitted
          </label>
          <input
            type="text"
            id="createdAt"
            name="createdAt"
            value={formatDateLong(formData.createdAt)}
            onChange={handleChange}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>

        <div>
          <label
            htmlFor="employee_payment_terms"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Payment Terms/Options
          </label>
          <select
            id="employee_payment_terms"
            name="employee_payment_terms"
            value={formData.employee_payment_terms}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
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
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Credit Period
            </label>
            <select
              id="user_credit_period"
              name="user_credit_period"
              value={formData.user_credit_period || ""}
              onChange={handleChange}
              disabled={isReadOnly}
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
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
  );
}
