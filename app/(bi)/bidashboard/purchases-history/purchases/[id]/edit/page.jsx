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
import BIApprovalSection from "@/components/FormEditComponents/BIApprovalSection";
import EditFormSkeleton from "@/components/skeletons/EditFormSkeleton";
import UnauthorizedEdit from "@/components/Reusables/UnauthorizedEdit";
import { LoadingBarWave } from "@/components/Reusables/LoadingBar";
import { clearFormData } from "@/public/assets";
import { FilePen } from "lucide-react";

export default function EditPurchaseForm({ params }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [biApproval, setBiApproval] = useState(null);
  const [submitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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
    createdat: "",
    employee_payment_terms: "",
    user_credit_period: "",
    is_employed: "",
    on_probation: "",
    hr_comments: "",
    hr_approval: "",
    hr_approver_name: "",
    hr_approval_date: "",
    credit_period: "",
    one_third_rule: "",
    purchase_history_comments: "",
    pending_invoices: "",
    cc_approval: "",
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
    bi_approval: "",
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
          bi_approval: data.bi_approval || "",
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
      const response = await fetch(`/api/bi/biviewpurchases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update purchase");
      }

      setAlertMessage("Details updated successfully");
      setAlertType("success");
      setShowAlert(true);
      clearFormData(setFormData);

      setIsSubmitting(false);
      // Redirect back after 2 seconds
      // setTimeout(() => {
      //   router.push(`/bidashboard/purchases-history/purchases/${id}`);
      // }, 2000);
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
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="ml-4 flex cursor-pointer items-center text-red-900 hover:text-red-700"
        >
          <ArrowLeft className="mr-1 h-5 w-5" />
          Go Back
        </button>
        <div className="flex items-center gap-2">
          <FilePen className="h-6 w-6 text-red-900" />
          <h2 className="text-xl font-semibold text-red-900">
            Edit Purchase Request
          </h2>
        </div>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

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

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex cursor-pointer items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          >
            <X className="mr-2 h-4 w-4" />
            Close
          </button>
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center rounded-full border border-transparent bg-red-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          >
            <Save className="mr-2 h-4 w-4" />
            Save changes
          </button>
        </div>
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
