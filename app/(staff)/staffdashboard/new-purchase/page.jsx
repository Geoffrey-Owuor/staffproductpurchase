"use client";
import { useState } from "react";
import StaffInformation from "@/components/StaffInformation";
import ProductPricing from "@/components/ProductPricing";
import TermsConditions from "@/components/TermsConditions";
import Alert from "@/components/Alert";
import { LoadingBarWave } from "@/components/Reusables/LoadingBar";
import { ClipboardList } from "lucide-react";
import ConfirmationDialog from "@/components/Reusables/ConfirmationDialog";
import { useUser } from "@/context/UserContext";

export default function NewPurchase() {
  const user = useUser();
  const [formData, setFormData] = useState({
    // Staff Information
    staffName: user.name,
    payrollNo: user.payrollNo,
    department: user.department,

    // Product & Pricing
    itemName: "",
    itemStatus: "",
    productPolicy: "",
    productCode: "",
    tdPrice: "",
    discountRate: "",
    discountedValue: "",
    employee_payment_terms: "",
    user_credit_period: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/staffposts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setAlertMessage("Purchase request sent");
      setAlertType("success");
      setShowAlert(true);

      //Reset the form
      setFormData({
        staffName: "",
        payrollNo: "",
        department: "",
        itemName: "",
        itemStatus: "",
        productPolicy: "",
        productCode: "",
        tdPrice: "",
        discountRate: "",
        discountedValue: "",
        employee_payment_terms: "",
        user_credit_period: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlertMessage(
        error.message || "An error occurred while submitting the form",
      );
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-auto p-2 leading-relaxed dark:text-white">
        <div className="mb-5 flex items-center justify-center gap-2">
          <ClipboardList className="h-6 w-6 text-gray-900 dark:text-gray-200" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            PURCHASE FORM (Staff Information & Product Details)
          </h1>
        </div>

        <form
          id="staffInformation"
          onSubmit={(e) => {
            e.preventDefault();
            setShowConfirmDialog(true);
          }}
          autoComplete="off"
        >
          {isSubmitting && <LoadingBarWave isLoading={true} />}

          <StaffInformation formData={formData} handleChange={handleChange} />
          <ProductPricing
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mx-auto my-8 block rounded-xl bg-gray-900 px-6 py-2.5 text-sm text-white transition-colors hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            Submit Purchase
          </button>
        </form>

        {/* Alert Component */}
        {showAlert && (
          <Alert
            message={alertMessage}
            type={alertType}
            onClose={() => setShowAlert(false)}
          />
        )}
      </div>
      {showConfirmDialog && (
        <ConfirmationDialog
          message="Are you sure you want to submit this purchase request?"
          onConfirm={() => {
            setShowConfirmDialog(false);
            handleSubmit();
          }}
          onCancel={() => setShowConfirmDialog(false)}
          title="Submit Purchase"
        />
      )}
      <TermsConditions />
    </>
  );
}
