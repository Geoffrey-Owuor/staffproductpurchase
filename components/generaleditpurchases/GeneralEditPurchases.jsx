"use client";
import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { PackagePlus, PlusCircle, Trash2 } from "lucide-react";
import Alert from "../Alert";
import StaffInformation from "../StaffInformation";
import ProductPricing from "../ProductPricing";
import PaymentDetails from "../PaymentDetails";
import EditFormSkeleton from "../skeletons/EditFormSkeleton";
import PayrollApprovalSection from "../FormEditComponents/PayrollApprovalSection";
import HRApprovalSection from "../FormEditComponents/HrApprovalSection";
import CreditControlSection from "../FormEditComponents/CreditControlSection";
import BIApprovalSection from "../FormEditComponents/BIApprovalSection";
import ConfirmationDialog from "../Reusables/ConfirmationDialog";
import UnauthorizedEdit from "../Reusables/UnauthorizedEdit";
import { LoadingBarWave } from "../Reusables/LoadingBar";
import { UseHandleViewClick } from "@/utils/HandleActionClicks/UseHandleViewClick";
import EditPurchaseHeading from "../EditPurchaseComponents/EditPurchaseHeading";
import SaveCloseComponent from "../EditPurchaseComponents/SaveCloseComponent";
import { usePurchase } from "@/context/PurchaseDetailsContext";
import { useUser } from "@/context/UserContext";
import { FetchPeriodsPolicies } from "@/app/lib/FetchPeriodsPolicies";
import { useApprovalCounts } from "@/context/ApprovalCountsContext";

// The initial state for a single product
const initialProductState = {
  itemName: "",
  itemStatus: "",
  productPolicy: "",
  productCode: "",
  tdPrice: "",
  discountRate: "",
  discountedValue: "",
};

//Getting today's date in mm/dd/yy format (Server time zone)
const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, "0");
const day = today.getDate().toString().padStart(2, "0");
const localTodayString = `${year}-${month}-${day}`;

function PurchaseForm({
  purchase,
  userRole,
  name,
  refetchCounts,
  handleHrefLink,
  id,
}) {
  //Other formdata from hr approval - billing & invoicing (initial state)
  const [formData, setFormData] = useState(() => {
    //initial products from the purchase data and setting products
    const initialProducts =
      purchase.products && purchase.products.length > 0
        ? purchase.products
        : [{ ...initialProductState }];

    // 2. Calculate the total from these initial products, mirroring your useMemo logic.
    const calculatedPurchaseTotal = initialProducts.reduce((total, product) => {
      const value = parseFloat(product.discountedValue) || 0;
      return total + value;
    }, 0);

    // Get default data for credit_period field
    const formulateCreditPeriod = () => {
      let formulatedPeriod;
      if (
        (purchase.employee_payment_terms === "CREDIT" ||
          purchase.employee_payment_terms === "CASH AND CREDIT") &&
        purchase.user_credit_period
      ) {
        formulatedPeriod = `${purchase.user_credit_period} ${purchase.user_credit_period === 1 ? "Month" : "Months"} Period`;
      } else if (purchase.employee_payment_terms === "CASH") {
        formulatedPeriod = "Cash Payment";
      } else {
        formulatedPeriod = "";
      }

      return formulatedPeriod;
    };

    return {
      //Payroll Data
      one_third_rule: purchase.one_third_rule || "",
      Payroll_Approval: purchase.Payroll_Approval || "",
      payroll_approver_name: purchase.payroll_approver_name || name,
      payroll_approval_date: purchase.payroll_approval_date || "",

      //HR Data
      is_employed: purchase.is_employed || "",
      on_probation: purchase.on_probation || "",
      hr_comments: purchase.hr_comments || "",
      HR_Approval: purchase.HR_Approval || "",
      hr_approver_name: purchase.hr_approver_name || name,
      hr_approval_date: purchase.hr_approval_date || "",

      //Credit Control Data
      credit_period: purchase.credit_period || formulateCreditPeriod(),
      purchase_history_comments: purchase.purchase_history_comments || "",
      pending_invoices: purchase.pending_invoices || "",
      CC_Approval: purchase.CC_Approval || "",
      cc_approver_name: purchase.cc_approver_name || name,
      cc_approval_date: purchase.cc_approval_date || "",

      //Billing & Invoice Data
      invoice_date: purchase.invoice_date
        ? purchase.invoice_date.split("T")[0]
        : localTodayString,
      invoice_number: purchase.invoice_number || "",
      invoice_amount:
        purchase.invoice_amount || calculatedPurchaseTotal.toFixed(2),

      payment_reference: purchase.payment_reference || "",
      bi_approver_name: purchase.bi_approver_name || name,
      bi_approval_date: purchase.bi_approval_date || "",
      BI_Approval: purchase.BI_Approval || "",
    };
  });

  //Staff Information Data (initial state)
  const [staffInfo, setStaffInfo] = useState(() => ({
    staffName: purchase.staffName || "",
    payrollNo: purchase.payrollNo || "",
    department: purchase.department || "",
  }));

  //Payment Information Data (initial state)
  const [paymentInfo, setPaymentInfo] = useState(() => ({
    employee_payment_terms: purchase.employee_payment_terms || "",
    invoicing_location: purchase.invoicing_location || "",
    delivery_details: purchase.delivery_details || "",
    user_credit_period: purchase.user_credit_period || "",
    mpesa_code: purchase.mpesa_code || "",
    createdAt: purchase.createdAt || "",
  }));

  const [products, setProducts] = useState(() =>
    purchase.products && purchase.products.length > 0
      ? purchase.products
      : [{ ...initialProductState }],
  );

  const [submitting, setIsSubmitting] = useState(false);
  const [discountPolicies, setDiscountPolicies] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alertType, setAlertType] = useState("success");

  //Initially setting periods to an empty array
  const [periods, setPeriods] = useState([]);

  //useEffect for fetching credit periods and discount policies
  useEffect(() => {
    const fetchData = async () => {
      // Fetching credit periods and discount policies
      const { periods, policies } = await FetchPeriodsPolicies();

      //Setting the credit periods and discount policies
      setPeriods(periods);
      setDiscountPolicies(policies);
    };
    fetchData();
  }, []);

  //Handler for other formdata change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //Handler for staff change
  const handleStaffChange = (e) => {
    const { name, value } = e.target;
    setStaffInfo((prev) => ({ ...prev, [name]: value }));
  };

  //Handle for payment change
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  //Handler for product change
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [name]: value } : product,
    );

    setProducts(updatedProducts);
  };

  //Setting fetched product data (data fetched from Orion Api)
  const setProductData = (index, updater) => {
    setProducts((currentProducts) =>
      currentProducts.map((product, i) => {
        if (i === index) {
          // Check if the 'updater' is a function (the (prev) => ... pattern)
          if (typeof updater === "function") {
            // If it is, call it with the current product to get the new state
            return updater(product);
          }
          // Otherwise, it's a plain object, so merge it
          return { ...product, ...updater };
        }
        return product;
      }),
    );
  };

  //Adding a product
  const addProduct = () => {
    setProducts([...products, { ...initialProductState }]);
  };

  //Removing a product
  const removeProduct = (index) => {
    if (products.length > 1) {
      //Prevent removing the last item
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
    }
  };

  //Calculating the total discountedValue from the products
  const purchaseTotal = useMemo(() => {
    //Using reduce to sum up discounted value of all products
    return products.reduce((total, product) => {
      const value = parseFloat(product.discountedValue) || 0;
      return total + value;
    }, 0);
  }, [products]);

  //Setting amount received based on calculated products total from useMemo
  useEffect(() => {
    // We only update if purchaseTotal is a valid number greater than 0
    // to avoid overwriting the initial amount with 0 during setup.
    if (purchaseTotal > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        invoice_amount: purchaseTotal.toFixed(2),
      }));
    }
  }, [purchaseTotal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Show confirmation dialog instead of submitting directly
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);

    //Consolidate all form data into a single object
    const fullFormData = {
      ...formData,
      ...staffInfo,
      ...paymentInfo,
      products: products,
    };
    try {
      const response = await fetch(`/api/generaleditpurchases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "failed to update purchase");
      }

      setAlertMessage(
        result.message ||
          "Purchase request has been updated successfully, Redirecting...",
      );
      setAlertType("success");
      setShowAlert(true);

      setIsSubmitting(false);

      // Refetch approval counts
      refetchCounts();

      // Redirect back after 0.7 seconds
      setTimeout(() => {
        handleHrefLink(id);
      }, 700);
    } catch (err) {
      console.error("Error updating purchase:", err);
      setAlertMessage(err.message || "Failed to update purchase");
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-auto p-2">
        <EditPurchaseHeading />

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          {submitting && <LoadingBarWave isLoading={true} />}

          {/* Staff Info Component */}
          <StaffInformation
            formData={staffInfo}
            handleChange={handleStaffChange}
            userRole={userRole}
          />

          {/* Payment Details Component */}
          <PaymentDetails
            formData={paymentInfo}
            handleChange={handlePaymentChange}
            userRole={userRole}
            periods={periods}
          />

          {/* Main Product Pricing title */}
          <div className="mt-8 mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <PackagePlus className="h-6 w-6" />
            <span className="text-xl">Product & Pricing Details</span>
          </div>
          {userRole === "cc" && (
            <p className="text-xs">
              <span className="font-semibold text-red-500 dark:text-red-400">
                Note:{" "}
              </span>
              Don't forget to check the "Other Details" field for items being
              bought at offer prices
            </p>
          )}

          {/* Map over the products array to render a component for each */}
          {products.map((product, index) => (
            <div key={index} className="relative">
              <ProductPricing
                formData={product}
                handleChange={(e) => handleProductChange(index, e)}
                setFormData={(data) => setProductData(index, data)}
                discountPolicies={discountPolicies}
                productNumber={index + 1}
                userRole={userRole}
                paymentTerms={paymentInfo.employee_payment_terms}
              />
              {/* Removing a product - Only when role is bi */}
              {products.length > 1 && userRole === "bi" && (
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="absolute top-2 right-4 rounded-full p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-[#4c2e2f]"
                  title="Remove Product"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}

          <div className="my-12 flex items-center justify-between">
            {purchaseTotal > 0 && (
              <span className="text-lg">
                Total Purchase Value:{" "}
                <span className="font-bold">{`Ksh ${purchaseTotal.toFixed(2)}`}</span>
              </span>
            )}
            {/* Adding a product - Only when role is bi */}
            {userRole === "bi" && (
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                <PlusCircle className="h-5 w-5" />
                Add Product
              </button>
            )}
          </div>

          <PayrollApprovalSection
            formData={formData}
            userRole={userRole}
            handleChange={handleChange}
          />

          {(userRole === "hr" || userRole === "cc" || userRole === "bi") && (
            <HRApprovalSection
              formData={formData}
              handleChange={handleChange}
              userRole={userRole}
            />
          )}
          {(userRole === "cc" || userRole === "bi") && (
            <CreditControlSection
              formData={formData}
              handleChange={handleChange}
              userRole={userRole}
            />
          )}
          {userRole === "bi" && (
            <BIApprovalSection
              formData={formData}
              handleChange={handleChange}
              userRole={userRole}
            />
          )}

          <SaveCloseComponent
            payrollApproval={purchase.Payroll_Approval}
            hrApproval={purchase.HR_Approval}
            ccApproval={purchase.CC_Approval}
          />
        </form>
      </div>

      {/* Confirmation Dialogue */}
      <AnimatePresence>
        {showConfirmation && (
          <ConfirmationDialog
            message="Are you sure you want to submit these request changes? (You can't edit once approved)"
            onConfirm={handleConfirmSubmit}
            onCancel={() => setShowConfirmation(false)}
            title="Confirm Changes"
          />
        )}
      </AnimatePresence>

      {/* Alert Component */}
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
}

// The Loader component

export default function GeneralEditPurchases({ id }) {
  const { role: userRole, name } = useUser();
  const { purchase, loading, error } = usePurchase();
  const { refetchCounts } = useApprovalCounts();
  const handleViewClick = UseHandleViewClick();

  // 1. Context Loading State
  if (loading) {
    return <EditFormSkeleton />;
  }

  // 2. Error or No Data State
  if (error || !purchase) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2>Failed to Load</h2>
        <p>{error || "Purchase details could not be found."}</p>
      </div>
    );
  }

  // 3. Authorization State
  if (
    (userRole === "payroll" &&
      (purchase.Payroll_Approval === "approved" ||
        purchase.Payroll_Approval === "declined")) ||
    (userRole === "hr" &&
      (purchase.HR_Approval === "approved" ||
        purchase.HR_Approval === "declined" ||
        purchase.Payroll_Approval === "declined")) ||
    (userRole === "cc" &&
      (purchase.CC_Approval === "approved" ||
        purchase.CC_Approval === "declined" ||
        purchase.Payroll_Approval === "declined" ||
        purchase.HR_Approval === "declined")) ||
    (userRole === "bi" &&
      (purchase.BI_Approval === "approved" ||
        purchase.BI_Approval === "declined" ||
        purchase.Payroll_Approval === "declined" ||
        purchase.HR_Approval === "declined" ||
        purchase.CC_Approval === "declined"))
  ) {
    return <UnauthorizedEdit role={userRole} />;
  }

  return (
    <PurchaseForm
      key={purchase.id} //Forces a remount and all props when id changes
      purchase={purchase}
      userRole={userRole}
      name={name}
      refetchCounts={refetchCounts}
      handleHrefLink={handleViewClick}
      id={id}
    />
  );
}
