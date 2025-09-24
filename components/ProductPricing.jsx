import { useEffect, useState } from "react";
import FormAsterisk from "./Reusables/FormAsterisk/FormAsterisk";
import useDebounce from "./Reusables/Debouncing/useDebounce";
import { X } from "lucide-react";

const discountPolicy = {
  "Von Hotpoint on Account": { New: 10, RHD2: 15 },
  "Von Hotpoint on Cash Payment": { New: 12.5, RHD2: 17.5 },
  "Non Von Hotpoint on Cash Payment": { New: 10, RHD2: 15 },
  "Non Von Hotpoint on Account": { New: 7.5, RHD2: 12.5 },
  "Samsung Brand on Cash payment": { New: 5, RHD2: 7.5 },
  "Samsung Brand on Account": { New: 2.5, RHD2: 5 },
};

const ProductPricing = ({ formData, handleChange, setFormData }) => {
  const [fetchedDetails, setFetchedDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  //Using debounced productcode
  const debouncedCode = useDebounce(formData.productCode, 1000);

  useEffect(() => {
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

  return (
    <div className="relative mb-8 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
      <div className="rounded-t-xl px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white">
        Product & Pricing Details
      </div>

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
          <p className="text-sm text-gray-900 dark:text-white">
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
      <div className="mt-8 space-y-6 overflow-x-auto px-6 py-4">
        {/* Grouped Inputs - 2 columns on md+ */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Product Code */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Product Code <FormAsterisk />
              {/* Small loading spinner */}
              {loading && (
                <div className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-500 border-t-transparent dark:border-gray-400 dark:border-t-transparent"></div>
              )}
            </label>
            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              required
            />
          </div>
          {/* Item Name*/}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Item Name <FormAsterisk />
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
          {/* Item Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Status (New / RHD2) <FormAsterisk />
            </label>
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
          </div>

          {/* Product Policy */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Item Policy Type <FormAsterisk />
            </label>
            <select
              name="productPolicy"
              value={formData.productPolicy || ""}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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

          {/* TD Price */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              TD Price
            </label>
            <input
              type="number"
              step="0.01"
              name="tdPrice"
              value={formData.tdPrice}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          {/* Discount Rate */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Discount Rate
            </label>
            <input
              type="number"
              step="0.01"
              name="discountRate"
              value={formData.discountRate}
              readOnly
              className="w-full rounded-xl border border-gray-200 bg-gray-100 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          {/* Discounted Value */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Discounted Value
            </label>
            <input
              type="number"
              step="0.01"
              name="discountedValue"
              value={formData.discountedValue}
              readOnly
              className="w-full rounded-xl border border-gray-200 bg-gray-100 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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
        </div>

        {/* Payment Terms */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Conditional Credit Period */}
          {formData.employee_payment_terms === "CREDIT" && (
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
