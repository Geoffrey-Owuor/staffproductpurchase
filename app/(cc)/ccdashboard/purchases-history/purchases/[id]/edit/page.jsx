"use client";
import { useState, useEffect } from "react";
import Alert from "@/components/Alert";
import StaffInfoSection from "@/components/FormEditComponents/StaffInfoSection";
import ProductDetailsSection from "@/components/FormEditComponents/ProductDetailsSection";
import HRApprovalSection from "@/components/FormEditComponents/HrApprovalSection";
import CreditControlSection from "@/components/FormEditComponents/CreditControlSection";
import ConfirmationDialog from "@/components/Reusables/ConfirmationDialog";
import EditFormSkeleton from "@/components/skeletons/EditFormSkeleton";
import UnauthorizedEdit from "@/components/Reusables/UnauthorizedEdit";
import { LoadingBarWave } from "@/components/Reusables/LoadingBar";
import { clearFormData } from "@/public/assets";
import EditPurchaseHeading from "@/components/EditPurchaseComponent/EditPurchaseHeading";
import SaveCloseComponent from "@/components/EditPurchaseComponent/SaveCloseComponent";
import { useUser } from "@/context/UserContext";

export default function EditPurchaseForm({ params }) {
  const { role: userRole, name: userName } = useUser();
  const [loading, setLoading] = useState(true);
  const [biApproval, setBiApproval] = useState(null);
  const [submitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    const fetchPurchaseData = async () => {
      const { id } = await params;
      try {
        const response = await fetch(`/api/cc/ccviewpurchases/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch purchase data");
        }

        setBiApproval(data.bi_approval);

        setFormData({
          staffname: data.staffname || "",
          payrollno: data.payrollno || "",
          department: data.department || "",
          itemname: data.itemname || "",
          itemstatus: data.itemstatus || "",
          productpolicy: data.productpolicy || "",
          productcode: data.productcode || "",
          tdprice: data.tdprice || "",
          discountrate: data.discountrate || "",
          discountedvalue: data.discountedvalue || "",
          createdat: data.createdat || "",
          employee_payment_terms: data.employee_payment_terms || "",
          user_credit_period: data.user_credit_period || "",
          is_employed: data.is_employed || "",
          on_probation: data.on_probation || "",
          hr_comments: data.hr_comments || "",
          hr_approval: data.hr_approval || "",
          hr_approver_name: data.hr_approver_name || "",
          hr_approval_date: data.hr_approval_date || "",
          credit_period: data.credit_period || "",
          one_third_rule: data.one_third_rule || "",
          purchase_history_comments: data.purchase_history_comments || "",
          pending_invoices: data.pending_invoices || "",
          cc_approval: data.cc_approval || "",
          cc_approver_name: data.cc_approver_name || userName,
          cc_approval_date: data.cc_approval_date || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching purchase data:", err);
        setAlertMessage("Error fetching purchase data");
        setAlertType("error");
        setShowAlert(true);
        setLoading(false);
      }
    };

    fetchPurchaseData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Show confirmation dialog instead of submitting directly
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    const { id } = await params;

    try {
      const response = await fetch(`/api/cc/ccviewpurchases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update purchase");
      }

      setAlertMessage("Request updated successfully");
      setAlertType("success");
      setShowAlert(true);
      clearFormData(setFormData);

      setIsSubmitting(false);

      // Redirect back after 2 seconds
      setTimeout(() => {
        window.location.href = `/ccdashboard/purchases-history/purchases/${id}`;
      }, 2000);
    } catch (err) {
      console.error("Error updating purchase:", err);
      setAlertMessage("Failed to update purchase");
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <EditFormSkeleton />;
  }

  if (biApproval === "approved") {
    return <UnauthorizedEdit role={userRole} />;
  }

  return (
    <div className="mx-auto p-2">
      <EditPurchaseHeading />

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        {submitting && <LoadingBarWave isLoading={true} />}
        <StaffInfoSection
          formData={formData}
          handleChange={handleChange}
          userRole={userRole}
        />
        <ProductDetailsSection
          formData={formData}
          handleChange={handleChange}
          userRole={userRole}
          setFormData={setFormData}
        />
        <HRApprovalSection
          formData={formData}
          handleChange={handleChange}
          userRole={userRole}
        />
        <CreditControlSection
          formData={formData}
          handleChange={handleChange}
          userRole={userRole}
        />

        <SaveCloseComponent />
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
