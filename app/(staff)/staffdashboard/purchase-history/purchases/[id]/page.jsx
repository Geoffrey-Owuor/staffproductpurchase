"use client";
import { ArrowLeft, ArrowUpRight, Edit, X } from "lucide-react";

import ApprovalStatus from "@/components/Reusables/ApprovalStatus";
import DetailField from "@/components/Reusables/DetailField";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import PurchaseDetailSkeleton from "@/components/skeletons/PurchaseDetailsSkeleton";

export default function ViewPurchase({ params }) {
  const { id } = use(params);
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        const res = await fetch(`/api/staffviewpurchases/${id}`);
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

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      router.push(`/staffdashboard/purchase-history/purchases/${id}/edit`);
    }, 100); // Short delay to show the spinner
  };

  const handleCloseClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.push("/staffdashboard");
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
          onClick={() => router.push("/staffdashboard")}
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-red-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
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
          onClick={() => router.push("/staffdashboard")}
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-red-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto p-2">
      {/* Header with back button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/staffdashboard")}
          className="flex cursor-pointer items-center text-red-900 hover:text-red-700"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </button>

        {/* Middle Edit Button */}
        <button
          onClick={handleEditClick}
          disabled={isEditing}
          className="flex cursor-pointer items-center justify-center gap-1 rounded-full bg-red-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700"
        >
          {isEditing ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Edit
            </>
          )}
        </button>

        <div className="flex items-center">
          <button
            onClick={() => router.push("/staffdashboard/purchase-history")}
            className="flex cursor-pointer items-center text-red-900 hover:text-red-700"
          >
            Purchase History
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Details Card */}
      <div className="rounded-2xl border border-red-200 bg-white shadow-md">
        {/* Staff Information Section */}
        <div className="border-b border-red-200 p-6">
          <h2 className="mb-4 text-lg font-bold text-red-900">
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
          <h2 className="mb-4 text-lg font-bold text-red-900">
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
          <h2 className="mb-4 text-lg font-bold text-red-900">
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
            <h2 className="mb-4 text-lg font-bold text-red-900">
              Approval Status
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
            <h2 className="mb-4 text-lg font-bold text-red-900">Metadata</h2>
            <div className="space-y-4">
              <DetailField
                label="Date"
                value={
                  purchase.createdat
                    ? new Date(purchase.createdat).toLocaleDateString()
                    : "N/A"
                }
              />
              <DetailField label="Signature" value={purchase.signature} />
              <DetailField
                label="Payment Terms/Options"
                value={purchase.employee_payment_terms}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons - Centered */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleEditClick}
          disabled={isEditing}
          className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full bg-red-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
        >
          {isEditing ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Edit
            </>
          )}
        </button>
        <button
          onClick={handleCloseClick}
          disabled={isClosing}
          className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          {isClosing ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-700 border-t-transparent"></div>
          ) : (
            <>
              <X className="h-4 w-4" />
              Close
            </>
          )}
        </button>
      </div>
    </div>
  );
}
