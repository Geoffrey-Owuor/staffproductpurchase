import { useEffect, useState } from "react";
import FormAsterisk from "./Reusables/FormAsterisk/FormAsterisk";
import { X, Search } from "lucide-react";

const ProductPricing = ({
  formData,
  handleChange,
  setFormData,
  discountPolicies,
  userRole,
  paymentTerms,
  productNumber,
}) => {
  const [fetchedDetails, setFetchedDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    const code = formData.productCode?.trim();

    if (!code) {
      setFetchedDetails({ message: "Please enter a product code." }); // reset if input is empty
      return;
    }
    setLoading(true);
    setFetchedDetails(null); // Clear previous results

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

  //useEffect for automatic policy and rate selection
  useEffect(() => {
    // Guard clause to make sure this useEffect only runs when the user is staff or credit control
    if (!["staff", "cc"].includes(userRole)) {
      return;
    }

    const { itemName, itemStatus } = formData;

    // Guard clause: Don't run if we don't have all the needed info
    if (!paymentTerms || !itemName || !itemStatus || !discountPolicies) {
      return;
    }

    // Determine policy based on payment terms
    let policyPaymentType = ""; //Default
    if (paymentTerms === "CASH") {
      policyPaymentType = "on Cash Payment";
    } else if (
      paymentTerms === "CREDIT" ||
      paymentTerms === "CASH AND CREDIT"
    ) {
      policyPaymentType = "on Account";
    }

    // Determine policy based on brand name
    let policyBrand = "Non Von Hotpoint"; // Default
    const itemNameLower = itemName.toLowerCase();
    if (itemNameLower.startsWith("von")) {
      policyBrand = "Von Hotpoint";
    } else if (itemNameLower.startsWith("samsung")) {
      policyBrand = "Samsung Brand";
    }

    // Construct the full policy name to search for
    const fullPolicyName = `${policyBrand} ${policyPaymentType}`;

    // Find the matching policy from the list
    const matchedPolicy = discountPolicies.find(
      (policy) =>
        policy.policy_name === fullPolicyName && policy.category === itemStatus,
    );

    if (matchedPolicy) {
      // If a match is found, update the form data with the policy and rate
      setFormData((prev) => ({
        ...prev,
        productPolicy: matchedPolicy.policy_name,
        discountRate: matchedPolicy.rate,
      }));
    } else {
      // If no policy matches, reset the policy and rate
      setFormData((prev) => ({
        ...prev,
        productPolicy: "",
        discountRate: 0,
      }));
    }
  }, [
    formData.itemName,
    formData.itemStatus,
    paymentTerms,
    discountPolicies,
    userRole,
  ]);

  useEffect(() => {
    const tdPrice = parseFloat(formData.tdPrice) || 0;
    const discountRate = parseFloat(formData.discountRate) || 0;

    const discountedValue = tdPrice * (1 - discountRate / 100);
    setFormData((prev) => ({
      ...prev,
      discountedValue: discountedValue.toFixed(2),
    }));
  }, [formData.tdPrice, formData.discountRate]);

  const editableRoles = ["staff", "cc"];
  const staffReadOnly = userRole !== "staff";
  const ccReadOnly = userRole !== "cc";
  const isReadonlyGeneral = !editableRoles.includes(userRole);

  return (
    <div className="bg-gradient-classes relative rounded-xl">
      <div className="rounded-t-xl px-2 py-3 text-lg font-semibold text-gray-900 dark:text-white">
        Product {productNumber}
      </div>

      {/* Checking the inputed product code from ORION api and returning product name and TD price */}
      {formData.productCode?.trim() !== "" && fetchedDetails?.itemName && (
        <div
          className="absolute top-1.5 left-4 z-10 w-80 cursor-pointer rounded-lg border border-gray-300 bg-white p-2 shadow-lg md:left-43 dark:border-gray-700 dark:bg-gray-900"
          onClick={handleSelectFetched}
        >
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {fetchedDetails.itemName}
          </p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            TD Price: {fetchedDetails.tdPrice}
          </p>
          <p className="text-xs text-gray-400 italic">(Click to select)</p>
        </div>
      )}

      {/* Returning a fallback message when product is not found */}
      {formData.productCode?.trim() !== "" && fetchedDetails?.message && (
        <div className="absolute top-2 left-4 z-10 w-80 cursor-pointer rounded-lg border border-gray-300 bg-white p-2 shadow-lg md:left-43 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-900 dark:text-white">
            {fetchedDetails.message}
          </p>
          {/* Close Icon */}
          <div
            className="absolute top-1.5 left-73 z-20 cursor-pointer p-1 text-gray-500 hover:text-gray-400"
            onClick={() => setFetchedDetails(null)}
          >
            <X className="h-4 w-4" />
          </div>
        </div>
      )}
      <div className="space-y-6 overflow-x-auto px-2 py-4">
        {/* Grouped Inputs - 2 columns on md+ */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Product Code */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400">
              Product Code (SKU) <FormAsterisk />
              {/* Small loading spinner */}
              {loading && (
                <div className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-500 border-t-transparent dark:border-gray-400 dark:border-t-transparent"></div>
              )}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleChange}
                className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadonlyGeneral ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
                required
                readOnly={isReadonlyGeneral}
              />
              {(userRole === "staff" || userRole === "cc") && (
                <button
                  type="button"
                  onClick={fetchDetails}
                  disabled={loading} // Disable button while loading
                  className="absolute right-3 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          {/* Item Name*/}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400">
              Item Name <FormAsterisk />
            </label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${isReadonlyGeneral ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
              required
              readOnly={isReadonlyGeneral}
              title={formData.itemName}
            />
          </div>
          {/* Item Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400">
              Status (New / RHD2) <FormAsterisk />
            </label>
            <select
              name="itemStatus"
              value={formData.itemStatus}
              onChange={handleChange}
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${staffReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
              required
              disabled={staffReadOnly}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="New">New</option>
              <option value="RHD2">RHD2</option>
            </select>
          </div>

          {/* Product Policy Type */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400">
              Item Policy Type
            </label>
            <input
              type="text"
              value={formData.productPolicy}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-100 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              readOnly
              title={formData.productPolicy}
            />
          </div>

          {/* TD Price */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400">
              Initial Price <FormAsterisk />
            </label>
            <input
              type="number"
              step="0.01"
              name="tdPrice"
              value={formData.tdPrice}
              onChange={handleChange}
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${ccReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
              readOnly={ccReadOnly}
              required
            />
          </div>

          {/* Discount Rate */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400">
              Discount Rate <FormAsterisk />
            </label>
            <input
              type="number"
              step="0.01"
              name="discountRate"
              value={formData.discountRate}
              onChange={handleChange}
              readOnly={ccReadOnly}
              required
              className={`w-full rounded-xl border border-gray-200 p-2 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:text-white ${ccReadOnly ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-950"}`}
            />
          </div>

          {/* Discounted Value */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-400">
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
        </div>
      </div>
    </div>
  );
};

export default ProductPricing;
