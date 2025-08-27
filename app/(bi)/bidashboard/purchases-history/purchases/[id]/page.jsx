"use client";
import { ArrowLeft, ArrowUpRight, Edit, X, Download } from "lucide-react";
import ApprovalStatus from "@/components/Reusables/ApprovalStatus";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import PurchaseDetailSkeleton from "@/components/skeletons/PurchaseDetailsSkeleton";
import { generateClientPDF } from "@/utils/returnPurchasePDF";
import DetailField from "@/components/Reusables/DetailField";
import { LoadingBar } from "@/components/Reusables/LoadingBar";
import { formatDateLong } from "@/public/assets";

export default function ViewPurchase({ params }) {
  const { id } = use(params);
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        const res = await fetch(`/api/bi/biviewpurchases/${id}`);
        if (!res.ok) throw new Error("Failed to fetch purchase");
        const data = await res.json();
        setPurchase(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [id]);

  //Generate pdf document version of the data
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateClientPDF(purchase);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      router.push(`/bidashboard/purchases-history/purchases/${id}/edit`);
    }, 100); // Short delay to show the spinner
  };

  const handleCloseClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.push("/bidashboard");
    }, 100); // Short delay to show the spinner
  };

  if (loading) {
    return <PurchaseDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto p-6 text-center">
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          Error: {error}
        </div>
        <button
          onClick={() => router.push("/bidashboard")}
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-red-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="mx-auto p-6 text-center">
        <div className="rounded-lg bg-yellow-100 p-4 text-yellow-700">
          No purchase data found
        </div>
        <button
          onClick={() => router.push("/bidashboard")}
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-red-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto p-2">
      {(isEditing || isClosing) && <LoadingBar isLoading={true} />}
      {/* Header with back button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/bidashboard")}
          className="ml-4 flex cursor-pointer items-center text-red-900 hover:text-red-700"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </button>

        {/* Middle Edit Button */}
        {purchase.bi_approval !== "approved" && (
          <button
            onClick={handleEditClick}
            disabled={isEditing}
            className="flex cursor-pointer items-center justify-center gap-1 rounded-full bg-red-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        )}

        <div className="mr-4 flex items-center gap-4">
          <button
            onClick={handleDownload}
            className={`relative flex items-center justify-center gap-1 rounded-full bg-gray-100 p-2 text-sm text-black shadow-sm hover:bg-gray-200`}
            disabled={isDownloading}
          >
            {isDownloading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border border-t-transparent"></div>
              </div>
            )}
            <Download className="relative z-10 h-4 w-4" />
          </button>
          <button
            onClick={() => router.push("/bidashboard/purchases-history")}
            className="flex cursor-pointer items-center text-red-900 hover:text-red-700"
          >
            Purchases History
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Details Card */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {/* Staff Information Section */}
        <div className="border-b border-red-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-red-900">
            Staff Information
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <DetailField label="Staff Name" value={purchase.staffname} />
            <DetailField label="Payroll No" value={purchase.payrollno} />
            <DetailField label="Department" value={purchase.department} />
          </div>
        </div>
        {/* Product Information Section */}
        <div className="border-b border-red-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-red-900">
            Product Information
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <DetailField label="Item Name" value={purchase.itemname} />
            <DetailField label="Item Status" value={purchase.itemstatus} />
            <DetailField label="Product Code" value={purchase.productcode} />
          </div>
        </div>
        {/* Pricing Section */}
        <div className="border-b border-red-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-red-900">
            Pricing Details
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <DetailField
              label="TD Price"
              value={`Ksh ${Number(purchase.tdprice).toFixed(2)}`}
            />
            <DetailField
              label="Discount Rate"
              value={`${Number(purchase.discountrate).toFixed(2)}%`}
            />
            <DetailField
              label="Discounted Value"
              value={`Ksh ${Number(purchase.discountedvalue).toFixed(2)}`}
            />
          </div>
        </div>
        {/* Approval & Metadata Section */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-red-900">
              Approval Statuses
            </h2>
            <div className="space-y-4">
              <ApprovalStatus
                label="HR Approval"
                status={purchase.hr_approval}
              />
              <ApprovalStatus
                label="CC Approval"
                status={purchase.cc_approval}
              />
              <ApprovalStatus
                label="BI Approval"
                status={purchase.bi_approval}
              />
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold text-red-900">
              Metadata
            </h2>
            <div className="space-y-4">
              <DetailField
                label="Date Created"
                value={formatDateLong(purchase.createdat)}
              />

              <DetailField
                label="Payment Terms/Options"
                value={purchase.employee_payment_terms}
              />
            </div>
          </div>
        </div>

        {/* Payroll/HR Approval Section */}
        <div className="border-t border-red-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-red-900">
            Payroll/HR Approval
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ApprovalStatus
              label="Employment Status"
              status={purchase.is_employed || "n/a"}
            />
            <ApprovalStatus
              label="Probation Status"
              status={purchase.on_probation || "n/a"}
            />
            <ApprovalStatus
              label="Approval Status"
              status={purchase.hr_approval || "n/a"}
            />
            <DetailField
              label="HR Approver"
              value={purchase.hr_approver_name || "N/A"}
            />
            <DetailField
              label="HR Approval Date"
              value={formatDateLong(purchase.hr_approval_date)}
            />

            <div className="col-span-full">
              <DetailField
                label="HR Comments"
                value={purchase.hr_comments || "No comments provided"}
              />
            </div>
          </div>
        </div>

        {/* Credit Control Verification Section */}
        <div className="border-t border-red-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-red-900">
            Credit Control Verification and Approval
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Full-width text fields */}
            <div className="md:col-span-2">
              <DetailField
                label="Credit Period & Payment Modes"
                value={purchase.credit_period || "n/a"}
              />
            </div>

            <div className="md:col-span-2">
              <DetailField
                label="1/3 Rule Assessment"
                value={purchase.one_third_rule || "n/a"}
              />
            </div>

            <div className="md:col-span-2">
              <DetailField
                label="Purchase History Comments"
                value={purchase.purchase_history_comments || "n/a"}
              />
            </div>

            {/* Two-column fields */}
            <div>
              <DetailField
                label="Pending Invoices/Outstanding"
                value={purchase.pending_invoices || "n/a"}
              />
            </div>

            <div>
              <ApprovalStatus
                label="Approval Status"
                status={purchase.cc_approval || "n/a"}
              />
            </div>

            <div>
              <DetailField
                label="Checked By"
                value={purchase.cc_approver_name || "n/a"}
              />
            </div>

            <div>
              <DetailField
                label="CC Approval Date"
                value={formatDateLong(purchase.cc_approval_date)}
              />
            </div>
          </div>
        </div>

        {/* Invoicing Details Section */}
        <div className="border-t border-red-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-red-900">
            Invoicing Details
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DetailField
              label="Date of Invoice"
              value={formatDateLong(purchase.invoice_date)}
            />
            <DetailField
              label="Invoice No"
              value={purchase.invoice_number || "n/a"}
            />
            <DetailField
              label="Amount"
              value={
                purchase.invoice_amount
                  ? `Ksh ${Number(purchase.invoice_amount).toFixed(2)}`
                  : "n/a"
              }
            />

            <DetailField
              label="Invoiced By"
              value={purchase.bi_approver_name || "n/a"}
            />
            <DetailField
              label="Date Recorded"
              value={formatDateLong(purchase.invoice_recorded_date)}
            />
          </div>
        </div>

        {/* Payment Received Section */}
        <div className="border-t border-red-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-red-900">
            Payment Received
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DetailField
              label="Payment Method"
              value={purchase.payment_method || "n/a"}
            />
            <DetailField
              label="Reference Details"
              value={purchase.payment_reference || "n/a"}
            />
            <DetailField
              label="Payment Date"
              value={formatDateLong(purchase.payment_date)}
            />
            <DetailField
              label="Amount"
              value={
                purchase.amount
                  ? `Ksh ${Number(purchase.amount).toFixed(2)}`
                  : "n/a"
              }
            />
            <ApprovalStatus
              label="Approval Status"
              status={purchase.bi_approval || "n/a"}
            />
            <DetailField
              label="BI Approval Date"
              value={formatDateLong(purchase.bi_approval_date)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Buttons - Centered */}
      <div className="mt-6 flex justify-center gap-4">
        {purchase.bi_approval !== "approved" && (
          <button
            onClick={handleEditClick}
            disabled={isEditing}
            className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full bg-red-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        )}
        <button
          onClick={handleCloseClick}
          disabled={isClosing}
          className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <X className="h-4 w-4" />
          Close
        </button>
      </div>
    </div>
  );
}
