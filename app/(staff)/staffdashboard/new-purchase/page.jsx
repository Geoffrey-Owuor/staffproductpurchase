"use client";
import { useState, useEffect } from "react";
import StaffInformation from "@/components/StaffInformation";
import ProductPricing from "@/components/ProductPricing";
import TermsConditions from "@/components/TermsConditions";
import Alert from "@/components/Alert";
import { LoadingBarWave } from "@/components/Reusables/LoadingBar";
import { ClipboardList } from "lucide-react";
import ConfirmationDialog from "@/components/Reusables/ConfirmationDialog";

export default function NewPurchase() {
  const [formData, setFormData] = useState({
    // Staff Information
    staffname: "",
    payrollno: "",
    department: "",

    // Product & Pricing
    itemname: "",
    itemstatus: "",
    productpolicy: "",
    productcode: "",
    tdprice: "",
    discountrate: "",
    discountedvalue: "",
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

      const data = await response.json();
      console.log("Form submitted successfully:", data);

      setAlertMessage("Details Submitted Successfully");
      setAlertType("success");
      setShowAlert(true);

      //Reset the form
      setFormData({
        staffname: "",
        payrollno: "",
        department: "",
        itemname: "",
        itemstatus: "",
        productpolicy: "",
        productcode: "",
        tdprice: "",
        discountrate: "",
        discountedvalue: "",
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
      <div className="mx-auto p-2 leading-relaxed">
        <div className="mb-5 flex items-center justify-center gap-2">
          <ClipboardList className="h-6 w-6 text-red-900" />
          <h1 className="text-xl font-bold text-red-900">
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
            className={`mx-auto my-8 block cursor-pointer rounded-xl px-6 py-3 text-sm text-white transition-colors ${
              isSubmitting
                ? "cursor-not-allowed bg-gray-400"
                : "bg-red-800 hover:bg-red-900"
            }`}
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
        />
      )}
      <TermsConditions />
    </>
  );
}
