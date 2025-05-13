"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import Alert from "@/components/Alert";
import StaffInfoSection from "@/components/FormEditComponents/StaffInfoSection";
import ProductDetailsSection from "@/components/FormEditComponents/ProductDetailsSection";
import HRApprovalSection from "@/components/FormEditComponents/HrApprovalSection";
import EditFormSkeleton from "@/components/skeletons/EditFormSkeleton";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function EditPurchaseForm({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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
    is_employed: "",
    on_probation: "",
    hr_comments: "",
    HR_Approval: "",
    hr_approver_name: "",
    hr_approval_date: "",
    hr_signature: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    const fetchPurchaseData = async () => {
      const { id } = await params;
      try {
        const response = await fetch(
          `${BASE_URL}/api/hr/hrviewpurchases/${id}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch purchase data");
        }

        setFormData({
          staffName: data.staffName || "",
          payrollNo: data.payrollNo || "",
          department: data.department || "",
          itemName: data.itemName || "",
          itemStatus: data.itemStatus || "",
          productCode: data.productCode || "",
          tdPrice: data.tdPrice || "",
          discountRate: data.discountRate || "",
          discountedValue: data.discountedValue || "",
          date: data.date ? data.date.split("T")[0] : "",
          signature: data.signature || "",
          is_employed: data.is_employed || "",
          on_probation: data.on_probation || "",
          hr_comments: data.hr_comments || "",
          HR_Approval: data.HR_Approval || "",
          hr_approver_name: data.hr_approver_name || "",
          hr_approval_date: data.hr_approval_date
            ? data.hr_approval_date.split("T")[0]
            : "",
          hr_signature: data.hr_signature || "",
        });
      } catch (err) {
        console.error("Error fetching purchase data:", err);
        setAlertMessage("Error Fetching Purchase Data");
        setAlertType("error");
        setShowAlert(true);
      } finally {
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
    setIsSubmitting(true);
    const { id } = await params;
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/hr/hrviewpurchases/${id}`, {
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
        router.push(`/hrdashboard/requests-history/requests/${id}`);
      }, 2000);
    } catch (err) {
      console.error("Error updating purchase:", err);
      setAlertMessage("Failed to update purchase. Please try again.");
      setAlertType("error");
      setShowAlert(false);
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
