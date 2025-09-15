"use client";
import { useState, useEffect } from "react";
import Alert from "@/components/Alert";
import StaffInfoSection from "@/components/FormEditComponents/StaffInfoSection";
import ProductDetailsSection from "@/components/FormEditComponents/ProductDetailsSection";
import HRApprovalSection from "@/components/FormEditComponents/HrApprovalSection";
import CreditControlSection from "@/components/FormEditComponents/CreditControlSection";
import BIApprovalSection from "@/components/FormEditComponents/BIApprovalSection";
import ConfirmationDialog from "@/components/Reusables/ConfirmationDialog";
import EditFormSkeleton from "@/components/skeletons/EditFormSkeleton";
import UnauthorizedEdit from "@/components/Reusables/UnauthorizedEdit";
import { LoadingBarWave } from "@/components/Reusables/LoadingBar";
import { clearFormData } from "@/public/assets";
import EditPurchaseHeading from "@/components/EditPurchaseComponents/EditPurchaseHeading";
import SaveCloseComponent from "@/components/EditPurchaseComponents/SaveCloseComponent";

export default function EditPurchaseForm({ params }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [biApproval, setBiApproval] = useState(null);
  const [submitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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
    createdAt: "",
    employee_payment_terms: "",
    user_credit_period: "",
    is_employed: "",
    on_probation: "",
    hr_comments: "",
    HR_Approval: "",
    hr_approver_name: "",
    hr_approval_date: "",
    credit_period: "",
    one_third_rule: "",
    purchase_history_comments: "",
    pending_invoices: "",
    CC_Approval: "",
    cc_approver_name: "",
    cc_approval_date: "",
    invoice_date: "",
    invoice_number: "",
    invoice_amount: "",
    invoice_recorded_date: "",
    payment_method: "",
    payment_reference: "",
    payment_date: "",
    amount: "",
    bi_approver_name: "",
    bi_approval_date: "",
    BI_Approval: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/current-user");
        const data = await response.json();

        if (response.ok && data.valid) {
          setUserRole(data.role);
        } else {
          setUserRole("guest"); //Fallback Role
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setUserRole("guest");
      }
    };
    fetchUser();

    const fetchPurchaseData = async () => {
      const { id } = await params;
      try {
        const response = await fetch(`/api/bi/biviewpurchases/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch purchase data");
        }

        setBiApproval(data.BI_Approval);

        setFormData({
          staffName: data.staffName || "",
          payrollNo: data.payrollNo || "",
          department: data.department || "",
          itemName: data.itemName || "",
          itemStatus: data.itemStatus || "",
          productPolicy: data.productPolicy || "",
          productCode: data.productCode || "",
          tdPrice: data.tdPrice || "",
          discountRate: data.discountRate || "",
          discountedValue: data.discountedValue || "",
          createdAt: data.createdAt || "",
          employee_payment_terms: data.employee_payment_terms || "",
          user_credit_period: data.user_credit_period || "",
          is_employed: data.is_employed || "",
          on_probation: data.on_probation || "",
          hr_comments: data.hr_comments || "",
          HR_Approval: data.HR_Approval || "",
          hr_approver_name: data.hr_approver_name || "",
          hr_approval_date: data.hr_approval_date || "",
          credit_period: data.credit_period || "",
          one_third_rule: data.one_third_rule || "",
          purchase_history_comments: data.purchase_history_comments || "",
          pending_invoices: data.pending_invoices || "",
          CC_Approval: data.CC_Approval || "",
          cc_approver_name: data.cc_approver_name || "",
          cc_approval_date: data.cc_approval_date || "",
          invoice_date: data.invoice_date
            ? data.invoice_date.split("T")[0]
            : "",
          invoice_number: data.invoice_number || "",
          invoice_amount: data.invoice_amount || "",
          invoice_recorded_date: data.invoice_recorded_date
            ? data.invoice_recorded_date.split("T")[0]
            : "",
          payment_method: data.payment_method || "",
          payment_reference: data.payment_reference || "",
          payment_date: data.payment_date
            ? data.payment_date.split("T")[0]
            : "",
          amount: data.amount || "",
          bi_approver_name: data.bi_approver_name || "",
          bi_approval_date: data.bi_approval_date || "",
          BI_Approval: data.BI_Approval || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching purchase data:", err);
        setAlertMessage("Error fetching purchase Data");
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
    setShowConfirmation(true); // Show confirmation dialog instead of submitting directly
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    const { id } = await params;

    try {
      const response = await fetch(`/api/bi/biviewpurchases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("failed to update purchase");
      }

      setAlertMessage("Request updated successfully");
      setAlertType("success");
      setShowAlert(true);
      clearFormData(setFormData);

      setIsSubmitting(false);

      // Redirect back after 2 seconds
      setTimeout(() => {
        window.location.href = `/bidashboard/purchases-history/purchases/${id}`;
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
        <BIApprovalSection
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
