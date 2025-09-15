"use client";
import { ArrowLeft, ArrowUpRight, Edit, X } from "lucide-react";

import ApprovalStatus from "@/components/Reusables/ApprovalStatus";
import DetailField from "@/components/Reusables/DetailField";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import PurchaseDetailSkeleton from "@/components/skeletons/PurchaseDetailsSkeleton";
import { LoadingBar } from "@/components/Reusables/LoadingBar";
import { formatDateLong } from "@/public/assets";
import { useFinishLoading } from "@/app/hooks/useFinishLoading";
import LoadingLine from "@/components/Reusables/LoadingLine";

export default function ViewPurchase({ params }) {
  const { id } = use(params);
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingline, setIsLoadingLine] = useState(false);
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
    router.push(`/staffdashboard/purchase-history/purchases/${id}/edit`);
  };

  const handleRouterClick = (path) => {
    setIsLoadingLine(true);
    router.push(path);
  };

  const handleCloseClick = () => {
    setIsClosing(true);
    router.back();
  };

  useFinishLoading(isLoadingline, setIsLoadingLine, router);

  if (loading) {
    return <PurchaseDetailSkeleton />;
  }

  if (error) {
    return (
      <>
        <LoadingLine isLoading={isLoadingline} />
        <div className="mx-auto p-6 text-center dark:bg-gray-950">
          <div className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-white">
            Error: {error}
          </div>
          <button
            onClick={() => handleRouterClick("/staffdashboard")}
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </>
    );
  }

  if (!purchase) {
    return (
      <>
        <LoadingLine isLoading={isLoadingline} />
        <div className="mx-auto p-6 text-center dark:bg-gray-950">
          <div className="rounded-lg bg-yellow-100 p-4 text-yellow-700 dark:bg-yellow-900 dark:text-white">
            No purchase data found
          </div>
          <button
            onClick={() => handleRouterClick("/staffdashboard")}
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingLine isLoading={isLoadingline} />
      <div className="mx-auto p-2 dark:bg-gray-950">
        {isEditing && <LoadingBar isLoading={true} />}
        {/* Header with back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => handleRouterClick("/staffdashboard")}
            className="ml-4 flex cursor-pointer items-center text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-400"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </button>

          {/* Middle Edit Button */}
          {purchase.BI_Approval !== "approved" && (
            <button
              onClick={handleEditClick}
              disabled={isEditing}
              className="flex items-center justify-center gap-1 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}

          <div className="mr-4 flex items-center">
            <button
              onClick={() =>
                handleRouterClick("/staffdashboard/purchase-history")
              }
              className="flex cursor-pointer items-center text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-400"
            >
              Purchase History
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Details Card */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
          {/* Staff Information Section */}
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Staff Information
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <DetailField label="Staff Name" value={purchase.staffName} />
              <DetailField label="Payroll No" value={purchase.payrollNo} />
              <DetailField label="Department" value={purchase.department} />
            </div>
          </div>

          {/* Product Information Section */}
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Product Information
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <DetailField label="Item Name" value={purchase.itemName} />
              <DetailField label="Item Status" value={purchase.itemStatus} />
              <DetailField label="Product Code" value={purchase.productCode} />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Pricing Details
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <DetailField
                label="TD Price"
                value={`Ksh ${Number(purchase.tdPrice).toFixed(2)}`}
              />
              <DetailField
                label="Discount Rate"
                value={`${Number(purchase.discountRate).toFixed(2)}%`}
              />
              <DetailField
                label="Discounted Value"
                value={`Ksh ${Number(purchase.discountedValue).toFixed(2)}`}
              />
            </div>
          </div>

          {/* Approval & Metadata Section */}
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Approval Status
              </h2>
              <div className="space-y-4">
                <ApprovalStatus
                  label="HR Approval"
                  status={purchase.HR_Approval}
                />
                <ApprovalStatus
                  label="CC Approval"
                  status={purchase.CC_Approval}
                />
                <ApprovalStatus
                  label="BI Approval"
                  status={purchase.BI_Approval}
                />
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Metadata
              </h2>
              <div className="space-y-4">
                <DetailField
                  label="Date Created"
                  value={formatDateLong(purchase.createdAt)}
                />

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
          {purchase.BI_Approval !== "approved" && (
            <button
              onClick={handleEditClick}
              disabled={isEditing}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
          <button
            onClick={handleCloseClick}
            disabled={isClosing}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
            Close
          </button>
        </div>
      </div>
    </>
  );
}
