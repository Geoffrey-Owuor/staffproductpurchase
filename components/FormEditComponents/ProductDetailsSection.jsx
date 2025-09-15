import { formatDateLong } from "@/public/assets";
import { useEffect } from "react";

const discountpolicy = {
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
    const { itemstatus, productpolicy } = formData;
    if (itemstatus && productpolicy && discountpolicy[productpolicy]) {
      const rate = discountpolicy[productpolicy][itemstatus];
      if (rate !== undefined) {
        setFormData((prev) => ({
          ...prev,
          discountrate: rate,
        }));
      }
    }
  }, [formData.itemstatus, formData.productpolicy]);

  const isReadOnly = userRole != "staff";
  const isRequired = userRole === "cc";
  const ccReadOnly = userRole != "cc";
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
        {/* Item Name */}
        <div className="md:col-span-2">
          <label
            htmlFor="itemname"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Item Name
          </label>
          <input
            type="text"
            id="itemname"
            name="itemname"
            value={formData.itemname}
            onChange={handleChange}
            readOnly={isReadOnlyGeneral}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnlyGeneral
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            placeholder="Enter item name"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="itemstatus"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Status
          </label>
          <select
            id="itemstatus"
            name="itemstatus"
            value={formData.itemstatus}
            onChange={handleChange}
            disabled={isReadOnlyGeneral}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnlyGeneral
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            required
          >
            <option value="" disabled>
              Select status
            </option>
            <option value="New">New</option>
            <option value="RHD2">RHD2</option>
          </select>
        </div>

        {/* Policy */}
        <div>
          <label
            htmlFor="productpolicy"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Item Policy
          </label>
          <select
            id="productpolicy"
            name="productpolicy"
            value={formData.productpolicy}
            onChange={handleChange}
            disabled={isReadOnlyGeneral}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              formData.itemstatus === ""
                ? "text-gray-400"
                : "text-black dark:text-white"
            } ${
              isReadOnlyGeneral
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            required
          >
            <option value="" disabled>
              Select Policy
            </option>
            {Object.keys(discountpolicy).map((policy) => (
              <option key={policy} value={policy}>
                {policy}
              </option>
            ))}
          </select>
        </div>

        {/* Product Code */}
        <div>
          <label
            htmlFor="productcode"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Product Code
          </label>
          <input
            type="text"
            id="productcode"
            name="productcode"
            value={formData.productcode}
            onChange={handleChange}
            readOnly={isReadOnlyGeneral}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnlyGeneral
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            placeholder="Enter product code"
            required={isRequired}
          />
        </div>

        {/* TD Price */}
        <div>
          <label
            htmlFor="tdprice"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            TD Price (Ksh)
          </label>
          <input
            type="number"
            id="tdprice"
            name="tdprice"
            value={formData.tdprice}
            onChange={handleChange}
            readOnly={isReadOnlyGeneral}
            step="0.01"
            min="0"
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnlyGeneral
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            placeholder="Enter TD price"
            required={isRequired}
          />
        </div>

        {/* Discount Rate */}
        <div>
          <label
            htmlFor="discountrate"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
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
            readOnly={ccReadOnly}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-500 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-gray-400 ${
              ccReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
            placeholder="Enter discount rate"
            required={isRequired}
          />
        </div>

        {/* Discounted Value */}
        <div>
          <label
            htmlFor="discountedvalue"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
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
            className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="createdat"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Date Submitted
          </label>
          <input
            type="text"
            id="createdat"
            name="createdat"
            value={formatDateLong(formData.createdat)}
            onChange={handleChange}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>

        {/* Payment Terms */}
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
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
              isReadOnly
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            }`}
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

        {/* Credit Period if Credit chosen */}
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
              className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
                isReadOnly
                  ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-950"
              }`}
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
