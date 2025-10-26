import FormAsterisk from "./Reusables/FormAsterisk/FormAsterisk";
import { formatDateLong } from "@/public/assets";

const PaymentDetails = ({ formData, handleChange, userRole }) => {
  const editableRoles = ["bi", "staff"];
  const isReadOnly = !editableRoles.includes(userRole);
  return (
    <div className="relative mb-8 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
      <div className="rounded-t-xl px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
        Payment & Invoicing Details
      </div>
      <div className="space-y-6 px-6 py-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Invoicing Location */}
          <div>
            <label
              htmlFor="invoicing_location"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
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
              <option value="VILLAGE">Village Market Showroom</option>
            </select>
          </div>

          {/* Delivery Details */}
          <div>
            <label
              htmlFor="delivery_details"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Delivery/Pickup/Other Details <FormAsterisk />
            </label>
            <textarea
              id="delivery_details"
              name="delivery_details"
              value={formData.delivery_details || ""}
              onChange={handleChange}
              rows="3" //Text Area Height
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${
                isReadOnly
                  ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-950"
              }`}
              required
              disabled={isReadOnly}
              placeholder="Enter delivery address and contact person details if applicable..."
            />
          </div>

          {/* Payment Terms & Options */}
          <div>
            <label
              htmlFor="employee_payment_terms"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Payment Terms/Options <FormAsterisk />
            </label>
            <select
              id="employee_payment_terms"
              name="employee_payment_terms"
              value={formData.employee_payment_terms}
              onChange={handleChange}
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
              required
              disabled={isReadOnly}
            >
              <option value="" disabled>
                Select a payment option
              </option>
              <option value="CREDIT">Credit</option>
              <option value="CASH">Cash</option>
              <option value="CASH AND CREDIT">Cash & Credit</option>
            </select>
          </div>

          {/* Conditional Credit Period */}
          {(formData.employee_payment_terms === "CREDIT" ||
            formData.employee_payment_terms === "CASH AND CREDIT") && (
            <div>
              <label
                htmlFor="user_credit_period"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Credit Period <FormAsterisk />
              </label>
              <select
                id="user_credit_period"
                name="user_credit_period"
                value={formData.user_credit_period || ""}
                onChange={handleChange}
                className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
                required
                disabled={isReadOnly}
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

          {/* Date the purchase was submitted */}
          <div>
            <label
              htmlFor="createdAt"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
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
      </div>
    </div>
  );
};

export default PaymentDetails;
