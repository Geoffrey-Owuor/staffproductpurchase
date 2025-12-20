"use client";
import FormAsterisk from "./Reusables/FormAsterisk/FormAsterisk";
import { formatDateLong } from "@/public/assets";

const PaymentDetails = ({ formData, handleChange, userRole, periods }) => {
  const editableRoles = ["bi", "staff"];
  const staffReadonly = userRole !== "staff";
  const isReadOnly = !editableRoles.includes(userRole);
  return (
    <div className="bg-gradient-classes relative rounded-xl">
      <div className="rounded-t-xl px-2 py-3 text-lg font-semibold text-gray-900 dark:text-white">
        Payment & Invoicing Details
      </div>
      <div className="space-y-6 px-2 py-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Invoicing Location */}
          <div>
            <label
              htmlFor="invoicing_location"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400"
            >
              Invoicing Location <FormAsterisk />
            </label>
            <select
              id="invoicing_location"
              name="invoicing_location"
              value={formData.invoicing_location || ""}
              onChange={handleChange}
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
                isReadOnly
                  ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-950"
              }`}
              required
              disabled={isReadOnly}
            >
              <option value="" disabled>
                Select a location
              </option>
              <option value="SARIT">Sarit Showroom</option>
              <option value="RUIRU">Head Office (RUIRU)</option>
              <option value="GCS">Garden City Showroom</option>
              <option value="IMAARA">Imaara Showroom</option>
              <option value="KAREN">Karen Showroom</option>
              <option value="RIARA">Riara Showroom</option>
              <option value="KISUMU">Kisumu Showroom</option>
              <option value="ELDORET">Eldoret Showroom</option>
              <option value="NYALI">Nyali Showroom</option>
              <option value="LIKONI">Likoni Showroom</option>
              <option value="CBD">CBD Showroom</option>
              <option value="YAYA">Yaya Showroom</option>
              <option value="VILLAGE">Village Market Showroom</option>
              <option value="OTHER">
                Other(Indicate in other details section)
              </option>
            </select>
          </div>

          {/* Payment Terms & Options */}
          <div>
            <label
              htmlFor="employee_payment_terms"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400"
            >
              Payment Terms/Options <FormAsterisk />
            </label>
            <select
              id="employee_payment_terms"
              name="employee_payment_terms"
              value={formData.employee_payment_terms}
              onChange={handleChange}
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${staffReadonly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
              required
              disabled={staffReadonly}
            >
              <option value="" disabled>
                Select a payment option
              </option>
              <option value="CREDIT">Credit</option>
              <option value="CASH">Cash</option>
              <option value="CASH AND CREDIT">Cash & Credit</option>
            </select>
          </div>

          {/* Conditional mpesa-reference code */}
          {(formData.employee_payment_terms === "CASH" ||
            formData.employee_payment_terms === "CASH AND CREDIT") && (
            <div>
              <label
                htmlFor="mpesa_code"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400"
              >
                Mpesa code <FormAsterisk />
              </label>
              <input
                type="text"
                id="mpesa_code"
                name="mpesa_code"
                value={formData.mpesa_code}
                onChange={handleChange}
                readOnly={isReadOnly}
                maxLength={20}
                placeholder="Enter Mpesa reference code"
                required
                className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
              />
            </div>
          )}

          {/* Conditional Credit Period */}
          {(formData.employee_payment_terms === "CREDIT" ||
            formData.employee_payment_terms === "CASH AND CREDIT") && (
            <div>
              <label
                htmlFor="user_credit_period"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400"
              >
                Credit Period <FormAsterisk />
              </label>
              <select
                id="user_credit_period"
                name="user_credit_period"
                value={formData.user_credit_period || ""}
                onChange={handleChange}
                className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${staffReadonly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
                required
                disabled={staffReadonly}
              >
                <option value="" disabled>
                  Select period
                </option>
                {periods.map((period) => (
                  <option key={period.period_value} value={period.period_value}>
                    {period.period_description}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date the purchase was submitted */}
          <div>
            <label
              htmlFor="createdAt"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400"
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
        </div>
        <div className="grid grid-cols-1">
          {/* Delivery Details */}
          <div>
            <label
              htmlFor="delivery_details"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400"
            >
              Other Details <FormAsterisk />
            </label>
            <textarea
              id="delivery_details"
              name="delivery_details"
              value={formData.delivery_details || ""}
              onChange={handleChange}
              rows="3" //Text Area Height
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
                staffReadonly
                  ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-950"
              }`}
              required
              disabled={staffReadonly}
              placeholder="Enter other details applicable to this purchase request e.g., delivery/pickup details..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
