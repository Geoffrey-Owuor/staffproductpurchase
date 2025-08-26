"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import StaffInfoSection from "@/components/FormEditComponents/StaffInfoSection";
import ProductDetailsSection from "@/components/FormEditComponents/ProductDetailsSection";
import Alert from "@/components/Alert";
import ConfirmationDialog from "@/components/Reusables/ConfirmationDialog";
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
        const response = await fetch(`/api/staffviewpurchases/${id}`);
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
      const response = await fetch(`/api/staffviewpurchases/${id}`, {
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
      //   router.push(`/staffdashboard/purchase-history/purchases/${id}`);
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
