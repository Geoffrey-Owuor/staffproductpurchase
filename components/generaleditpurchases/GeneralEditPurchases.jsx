"use client";
import { useState, useEffect, useMemo } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import Alert from "../Alert";
import StaffInformation from "../StaffInformation";
import ProductPricing from "../ProductPricing";
import PaymentDetails from "../PaymentDetails";
import EditFormSkeleton from "../skeletons/EditFormSkeleton";
import HRApprovalSection from "../FormEditComponents/HrApprovalSection";
import CreditControlSection from "../FormEditComponents/CreditControlSection";
import BIApprovalSection from "../FormEditComponents/BIApprovalSection";
import ConfirmationDialog from "../Reusables/ConfirmationDialog";
import UnauthorizedEdit from "../Reusables/UnauthorizedEdit";
import { LoadingBarWave } from "../Reusables/LoadingBar";
import { useHandleHrefLink } from "@/utils/HandleActionClicks/UseHandleHrefLink";
import EditPurchaseHeading from "../EditPurchaseComponents/EditPurchaseHeading";
import SaveCloseComponent from "../EditPurchaseComponents/SaveCloseComponent";
import { usePurchase } from "@/context/PurchaseDetailsContext";
import { useUser } from "@/context/UserContext";
import { usePaymentBalanceCalculator } from "@/app/hooks/usePaymentBalanceCalculator";

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

export default function GeneralEditPurchases({ id }) {
  const { role: userRole } = useUser();
  const { purchase } = usePurchase();

  //Calling the hook at the top level, not outside of the component
  const handleHrefLink = useHandleHrefLink();

  const [loading, setLoading] = useState(true);
  const [submitting, setIsSubmitting] = useState(false);
  const [discountPolicies, setDiscountPolicies] = useState([]);

  //Other formdata from hr approval - billing & invoicing (initial state)
  const [formData, setFormData] = useState({});

  //Staff Information Data (initial state)
  const [staffInfo, setStaffInfo] = useState({});

  //Payment Information Data (initial state)
  const [paymentInfo, setPaymentInfo] = useState({});

  //Setting the products object into the array
  const [products, setProducts] = useState([{ ...initialProductState }]);
  const [showAlert, setShowAlert] = useState(false);
  const [hrApproval, setHrApproval] = useState(null);
  const [ccApproval, setCCApproval] = useState(null);
  const [biApproval, setBiApproval] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alertType, setAlertType] = useState("success");

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
    if (purchase) {
      setFormData({
        //HR Data
        is_employed: purchase.is_employed || "",
        on_probation: purchase.on_probation || "",
        hr_comments: purchase.hr_comments || "",
        HR_Approval: purchase.HR_Approval || "",
        hr_approver_name: purchase.hr_approver_name || "",
        hr_approval_date: purchase.hr_approval_date || "",

        //Credit Control Data
        credit_period: purchase.credit_period || "",
        one_third_rule: purchase.one_third_rule || "",
        purchase_history_comments: purchase.purchase_history_comments || "",
        pending_invoices: purchase.pending_invoices || "",
        CC_Approval: purchase.CC_Approval || "",
        cc_approver_name: purchase.cc_approver_name || "",
        cc_approval_date: purchase.cc_approval_date || "",

        //Billing & Invoice Data
        invoice_date: purchase.invoice_date
          ? purchase.invoice_date.split("T")[0]
          : "",
        invoice_number: purchase.invoice_number || "",
        invoice_amount: purchase.invoice_amount || "",
        invoice_recorded_date: purchase.invoice_recorded_date
          ? purchase.invoice_recorded_date.split("T")[0]
          : "",
        payment_method: purchase.payment_method || "",
        payment_reference: purchase.payment_reference || "",
        payment_date: purchase.payment_date
          ? purchase.payment_date.split("T")[0]
          : "",
        amount: purchase.amount || "",
        payment_balance: purchase.payment_balance || "",
        payment_completion: purchase.payment_completion || "",
        bi_approver_name: purchase.bi_approver_name || "",
        bi_approval_date: purchase.bi_approval_date || "",
        BI_Approval: purchase.BI_Approval || "",
      });
      setStaffInfo({
        staffName: purchase.staffName || "",
        payrollNo: purchase.payrollNo || "",
        department: purchase.department || "",
      });
      setPaymentInfo({
        employee_payment_terms: purchase.employee_payment_terms || "",
        invoicing_location: purchase.invoicing_location || "",
        delivery_details: purchase.delivery_details || "",
        user_credit_period: purchase.user_credit_period || "",
        createdAt: purchase.createdAt || "",
      });
      setProducts(
        purchase.products && purchase.products.length > 0
          ? purchase.products
          : [{ ...initialProductState }],
      );

      setBiApproval(purchase.BI_Approval);
      setHrApproval(purchase.HR_Approval);
      setCCApproval(purchase.CC_Approval);

      setLoading(false);
    }
  }, [purchase]);

  //Payment Balance Calculation
  usePaymentBalanceCalculator(formData, setFormData);

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

      setAlertMessage("Request Updated Successfully, Redirecting...");
      setAlertType("success");
      setShowAlert(true);

      setIsSubmitting(false);

      // Redirect back after 2 seconds
      setTimeout(() => {
        handleHrefLink(id);
      }, 2000);
    } catch (err) {
      console.error("Error updating purchase:", err);
      setAlertMessage(err.message || "Failed to update purchase");
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (biApproval === "approved") {
    return <UnauthorizedEdit role={userRole} />;
  }

  if (loading) {
    return <EditFormSkeleton />;
  }

  return (
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
        />

        {/* Map over the products array to render a component for each */}
        {products.map((product, index) => (
          <div key={index} className="relative">
            <ProductPricing
              formData={product}
              handleChange={(e) => handleProductChange(index, e)}
              setFormData={(data) => setProductData(index, data)}
              discountPolicies={discountPolicies}
              userRole={userRole}
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

        <HRApprovalSection
          formData={formData}
          handleChange={handleChange}
          userRole={userRole}
        />
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

        <SaveCloseComponent hrApproval={hrApproval} ccApproval={ccApproval} />
      </form>

      {/* Confirmation Dialogue */}
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to submit these changes?"
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmation(false)}
          title="Confirm Changes"
        />
      )}

      {/* Alert Component */}
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
