"use client";
import { useState, useEffect } from "react";
import StaffInformation from "@/components/StaffInformation";
import ProductPricing from "@/components/ProductPricing";
import TermsConditions from "@/components/TermsConditions";
import Alert from "@/components/Alert";
export default function NewPurchase() {
  const [formData, setFormData] = useState({
    // Staff Information
    staffName: "",
    payrollNo: "",
    department: "",

    // Product & Pricing
    itemName: "",
    itemStatus: "",
    productCode: "",
    tdPrice: "",
    discountRate: "",
    discountedValue: "",
    date: "",
    signature: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        staffName: "",
        payrollNo: "",
        department: "",
        itemName: "",
        itemStatus: "",
        productCode: "",
        tdPrice: "",
        discountRate: "",
        discountedValue: "",
        date: "",
        signature: "",
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
      <div className="mx-auto p-2 font-sans leading-relaxed">
        <div className="mb-5 text-center">
          <h1 className="text-xl font-bold text-red-900">
            PURCHASE FORM (Staff Information & Product Details)
          </h1>
        </div>

        <form id="staffInformation" onSubmit={handleSubmit}>
          <StaffInformation formData={formData} handleChange={handleChange} />
          <ProductPricing formData={formData} handleChange={handleChange} />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mx-auto my-8 block cursor-pointer rounded-full px-6 py-3 text-lg text-white transition-colors ${
              isSubmitting
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Form"}
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
      <TermsConditions />
    </>
  );
}
