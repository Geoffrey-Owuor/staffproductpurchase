"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import Alert from "@/components/Alert";
import StaffInfoSection from "@/components/FormEditComponents/StaffInfoSection";
import ProductDetailsSection from "@/components/FormEditComponents/ProductDetailsSection";
import HRApprovalSection from "@/components/FormEditComponents/HrApprovalSection";
import CreditControlSection from "@/components/FormEditComponents/CreditControlSection";
import ConfirmationDialog from "@/components/Reusables/ConfirmationDialog";
import EditFormSkeleton from "@/components/skeletons/EditFormSkeleton";

export default function EditPurchaseForm({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    staffname: "",
    payrollno: "",
    department: "",
    itemname: "",
    itemstatus: "",
    productcode: "",
    tdprice: "",
    discountrate: "",
    discountedvalue: "",
    createdat: "",
    employee_payment_terms: "",
    signature: "",
    is_employed: "",
    on_probation: "",
    hr_comments: "",
    hr_approval: "",
    hr_approver_name: "",
    hr_approval_date: "",
    hr_signature: "",
    credit_period: "",
    one_third_rule: "",
    purchase_history_comments: "",
    pending_invoices: "",
    cc_approval: "",
    cc_signature: "",
    cc_approval_date: "",
  });
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

        // Check if bi_approval is 'approved'
        if (data.bi_approval === "approved") {
          router.push(
            `/ccdashboard/purchases-history/purchases/${id}/unauthorized`,
          );
          return;
        }

        setFormData({
          staffname: data.staffname || "",
          payrollno: data.payrollno || "",
          department: data.department || "",
          itemname: data.itemname || "",
          itemstatus: data.itemstatus || "",
          productcode: data.productcode || "",
          tdprice: data.tdprice || "",
          discountrate: data.discountrate || "",
          discountedvalue: data.discountedvalue || "",
          createdat: data.createdat ? data.createdat.split("T")[0] : "",
          employee_payment_terms: data.employee_payment_terms || "",
          signature: data.signature || "",
          is_employed: data.is_employed || "",
          on_probation: data.on_probation || "",
          hr_comments: data.hr_comments || "",
          hr_approval: data.hr_approval || "",
          hr_approver_name: data.hr_approver_name || "",
          hr_approval_date: data.hr_approval_date
            ? data.hr_approval_date.split("T")[0]
            : "",
          hr_signature: data.hr_signature || "",
          credit_period: data.credit_period || "",
          one_third_rule: data.one_third_rule || "",
          purchase_history_comments: data.purchase_history_comments || "",
          pending_invoices: data.pending_invoices || "",
          cc_approval: data.cc_approval || "",
          cc_signature: data.cc_signature || "",
          cc_approval_date: data.cc_approval_date
            ? data.cc_approval_date.split("T")[0]
            : "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching purchase data:", err);
        setAlertMessage("Error Fetching Purchase Data");
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

      setAlertMessage("Details Updated Successfully");
      setAlertType("success");
      setShowAlert(true);

      setIsSubmitting(false);
      // Redirect back after 2 seconds
      setTimeout(() => {
        router.push(`/ccdashboard/purchases-history/purchases/${id}`);
      }, 200);
    } catch (err) {
      console.error("Error updating purchase:", err);
      setAlertMessage("Failed to update purchase. Please try again.");
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <EditFormSkeleton />;
  }

  return (
    <div className="mx-auto p-2">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex cursor-pointer items-center text-red-900 hover:text-red-700"
        >
          <ArrowLeft className="mr-1 h-5 w-5" />
          Go Back
        </button>
        <h2 className="text-2xl font-bold text-red-900">
          Edit Purchase Request
        </h2>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <StaffInfoSection formData={formData} handleChange={handleChange} />
        <ProductDetailsSection
          formData={formData}
          handleChange={handleChange}
        />
        <HRApprovalSection formData={formData} handleChange={handleChange} />
        <CreditControlSection formData={formData} handleChange={handleChange} />

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex cursor-pointer items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center rounded-full border border-transparent bg-red-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          >
            <Save className="mr-2 h-4 w-4" />
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Confirmation Dialogue */}
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to submit these changes?"
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmation(false)}
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
