import { formatDateLong } from "@/public/assets";
import { useState, useEffect } from "react";
import FormAsterisk from "../Reusables/FormAsterisk/FormAsterisk";
import useDebounce from "../Reusables/Debouncing/useDebounce";
import { X } from "lucide-react";

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
  const [fetchedDetails, setFetchedDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  //Using the debounced product code
  const debouncedCode = useDebounce(formData.productCode, 1000);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    const code = debouncedCode?.trim();

    if (!code || code === "") {
      setFetchedDetails(null); // reset if input is empty
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/getpurchasedetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productCode: code }),
        });

        const data = await response.json();

        if (!response.ok) {
          // API responded but with error/fallback
          setFetchedDetails({
            message: data.message || "No product found for this code",
          });
        } else {
          // API success response
          setFetchedDetails({
            itemName: data.itemName,
            tdPrice: data.tdPrice,
          });
        }
      } catch (err) {
        console.error("Error fetching details", err);
        setFetchedDetails({
          message: "Network or server error. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [debouncedCode]);

  const handleSelectFetched = () => {
    if (fetchedDetails) {
      setFormData((prev) => ({
        ...prev,
        itemName: fetchedDetails.itemName,
        tdPrice: fetchedDetails.tdPrice,
      }));
      setFetchedDetails(null);
    }
  };

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

  useEffect(() => {
    const tdPrice = parseFloat(formData.tdPrice);
    const discountRate = parseFloat(formData.discountRate);

    if (!isNaN(tdPrice) && !isNaN(discountRate)) {
      const discountedValue = tdPrice * (1 - discountRate / 100);
      setFormData((prev) => ({
        ...prev,
        discountedValue: discountedValue.toFixed(2),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        discountedValue: "",
      }));
    }
  }, [formData.tdPrice, formData.discountRate]);

  const isReadOnly = userRole != "staff";
  const ccReadOnly = userRole != "cc";
  const isRequired = userRole === "cc";
  const editableRoles = ["cc", "staff"];
  const isReadOnlyGeneral = !editableRoles.includes(userRole);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="relative px-6 py-3">
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
          Product and Pricing Details
        </h3>

        {/* Checking the inputed product code from ORION api and returning product name and TD price */}
        {formData.productCode?.trim() !== "" && fetchedDetails?.itemName && (
          <div
            className="absolute left-35 z-10 w-87 cursor-pointer rounded-lg border border-gray-300 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900"
            onClick={handleSelectFetched}
          >
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {fetchedDetails.itemName}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              TD Price: {fetchedDetails.tdPrice}
            </p>
            <p className="text-xs text-gray-400 italic">(Click to select)</p>
          </div>
        )}

        {/* Returning a fallback message when product is not found */}
        {formData.productCode?.trim() !== "" && fetchedDetails?.message && (
          <div className="absolute left-35 z-10 mt-1 w-80 cursor-pointer rounded-lg border border-gray-300 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <p className="truncate text-sm text-gray-900 dark:text-white">
              {fetchedDetails.message}
            </p>
            {/* Close Icon */}
            <div
              className="absolute top-1.5 left-73 z-20 cursor-pointer p-1 text-gray-500 hover:text-gray-400"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent onClick
                setFetchedDetails(null);
              }}
            >
              <X className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2 dark:bg-gray-950">
        <div>
          <label
            htmlFor="productCode"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Product Code <FormAsterisk />
            {/* Small loading spinner */}
            {loading && (
              <div className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-500 border-t-transparent dark:border-gray-400 dark:border-t-transparent"></div>
            )}
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
            required
          />
        </div>

        <div>
          <label
            htmlFor="itemName"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Item Name <FormAsterisk />
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
            Item Policy <FormAsterisk />
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
            Status <FormAsterisk />
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
            htmlFor="tdPrice"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            TD Price (Ksh) {isRequired ? <FormAsterisk /> : ""}
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
            Discount Rate (%) {isRequired ? <FormAsterisk /> : ""}
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
            Payment Terms/Options <FormAsterisk />
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
              Credit Period <FormAsterisk />
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
