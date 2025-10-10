import { formatDateLong } from "@/public/assets";
import { useState, useEffect } from "react";
import FormAsterisk from "../Reusables/FormAsterisk/FormAsterisk";
import useDebounce from "../Reusables/Debouncing/useDebounce";
import { X } from "lucide-react";

export default function ProductDetailsSection({
  formData,
  handleChange,
  userRole,
  setFormData,
}) {
  const [fetchedDetails, setFetchedDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [discountPolicies, setDiscountPolicies] = useState([]);

  //Using debounced productcode
  const debouncedCode = useDebounce(formData.productcode, 1000);

  //useEffect for fetching the discount policies
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch("/api/getdiscountpolicies");
        const json = await response.json();
        if (response.ok) {
          setDiscountPolicies(json.data);
        } else {
          console.error("Failed to fetch discount policies.");
        }
      } catch (error) {
        console.error("Error fetching discount policies: ", error);
      }
    };

    fetchPolicies();
  }, []);

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
          body: JSON.stringify({ productcode: code }),
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
            itemname: data.itemname,
            tdprice: data.tdprice,
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
        itemname: fetchedDetails.itemname,
        tdprice: fetchedDetails.tdprice,
      }));
      setFetchedDetails(null);
    }
  };

  //Matching discount policy to discount rate
  useEffect(() => {
    const { itemstatus, productpolicy } = formData;
    if (itemstatus && productpolicy) {
      const matchedPolicy = discountPolicies.find(
        (policy) =>
          policy.policy_name === productpolicy &&
          policy.category === itemstatus,
      );

      if (matchedPolicy) {
        setFormData((prev) => ({
          ...prev,
          discountrate: matchedPolicy.rate,
        }));
      }
    }
  }, [formData.itemstatus, formData.productpolicy]);

  useEffect(() => {
    const tdprice = parseFloat(formData.tdprice);
    const discountrate = parseFloat(formData.discountrate);

    if (!isNaN(tdprice) && !isNaN(discountrate)) {
      const discountedvalue = tdprice * (1 - discountrate / 100);
      setFormData((prev) => ({
        ...prev,
        discountedvalue: discountedvalue.toFixed(2),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        discountedvalue: "",
      }));
    }
  }, [formData.tdprice, formData.discountrate]);

  const isReadOnly = userRole != "staff";
  const isRequired = userRole === "cc";
  const ccReadOnly = userRole != "cc";
  const editableRoles = ["cc", "staff"];
  const isReadOnlyGeneral = !editableRoles.includes(userRole);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="relative px-6 py-3">
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
          Product and Pricing Details
        </h3>

        {/* Checking the inputed product code from ORION api and returning product name and TD price */}
        {formData.productcode?.trim() !== "" && fetchedDetails?.itemname && (
          <div
            className="absolute left-35 z-10 w-87 cursor-pointer rounded-lg border border-gray-300 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900"
            onClick={handleSelectFetched}
          >
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {fetchedDetails.itemname}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              TD Price: {fetchedDetails.tdprice}
            </p>
            <p className="text-xs text-gray-400 italic">(Click to select)</p>
          </div>
        )}

        {/* Returning a fallback message when product is not found */}
        {formData.productcode?.trim() !== "" && fetchedDetails?.message && (
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
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-2 dark:bg-gray-950">
        {/* Product Code */}
        <div>
          <label
            htmlFor="productcode"
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
            required
          />
        </div>

        {/* Item Name */}
        <div>
          <label
            htmlFor="itemname"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Item Name <FormAsterisk />
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
            Status <FormAsterisk />
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
            Item Policy <FormAsterisk />
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
            {[...new Set(discountPolicies.map((p) => p.policy_name))].map(
              (policy) => (
                <option key={policy} value={policy}>
                  {policy}
                </option>
              ),
            )}
          </select>
        </div>

        {/* TD Price */}
        <div>
          <label
            htmlFor="tdprice"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            TD Price (Ksh) {isRequired ? <FormAsterisk /> : ""}
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
            Discount Rate (%) {isRequired ? <FormAsterisk /> : ""}
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
            Payment Terms/Options <FormAsterisk />
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
              Credit Period <FormAsterisk />
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
              <option value="5">5 Months</option>
              <option value="6">6 Months</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
