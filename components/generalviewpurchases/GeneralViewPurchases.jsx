"use client";
import { ArrowLeft, ArrowUpRight, Edit, X, Download } from "lucide-react";
import ApprovalStatus from "../Reusables/ApprovalStatus";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PurchaseDetailSkeleton from "../skeletons/PurchaseDetailsSkeleton";
import DetailField from "../Reusables/DetailField";
import { generateClientPDF } from "@/utils/returnPurchasePDF";
import { LoadingBar } from "../Reusables/LoadingBar";
import { formatDateLong } from "@/public/assets";
import { useFinishLoading } from "@/app/hooks/useFinishLoading";
import LoadingLine from "../Reusables/LoadingLine";
import { UseHandleEditClick } from "@/utils/HandleActionClicks/UseHandleEditClick";
import { UseHandleHomeRoute } from "@/utils/HandleActionClicks/useHandleHomeRoute";
import ProductItemsInfo from "../ProductItemsInfo/ProductItemsInfo";
import { UseHandleHistoryRoute } from "@/utils/HandleActionClicks/useHandleHistoryRoute";
import { usePurchase } from "@/context/PurchaseDetailsContext";
import { useUser } from "@/context/UserContext";
import { formatCreditPeriod } from "@/public/assets";

export default function GeneralViewPurchases({ id }) {
  const { role: userRole } = useUser();
  const { purchase, loading, error } = usePurchase();
  const [isLoadingline, setIsLoadingLine] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const router = useRouter();

  //Generate pdf document version of the data
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateClientPDF({
        purchaseData: purchase,
        products: purchase.products || [],
        createdAt: purchase.createdAt,
        id: id,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEditClick = UseHandleEditClick();
  const handleHomeRoute = UseHandleHomeRoute();
  const handleHistoryRoute = UseHandleHistoryRoute();

  const gotoPurchaseEdit = (id) => {
    setIsEditing(true);
    handleEditClick(id);
  };

  const gotoHomeClick = () => {
    setIsLoadingLine(true);
    handleHomeRoute();
  };

  const gotoHistoryClick = () => {
    setIsLoadingLine(true);
    handleHistoryRoute();
  };

  const handleCloseClick = () => {
    setIsClosing(true);
    router.back();
  };

  useFinishLoading(isLoadingline, setIsLoadingLine);

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
            onClick={gotoHomeClick}
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </>
    );
  }

  if (!purchase || purchase.length === 0) {
    return (
      <>
        <LoadingLine isLoading={isLoadingline} />
        <div className="mx-auto p-6 text-center dark:bg-gray-950">
          <div className="rounded-lg bg-yellow-100 p-4 text-yellow-700 dark:bg-yellow-900 dark:text-white">
            No purchase data found
          </div>
          <button
            onClick={gotoHomeClick}
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
            onClick={gotoHomeClick}
            className="ml-4 flex cursor-pointer items-center text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-400"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </button>

          {/* Middle Edit Button */}
          {purchase.BI_Approval !== "approved" && userRole !== "staff" && (
            <button
              onClick={() => gotoPurchaseEdit(id)}
              disabled={isEditing}
              className="flex items-center justify-center gap-1 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}

          <div className="mr-4 flex items-center gap-4">
            <button
              onClick={handleDownload}
              className={`relative flex items-center justify-center gap-1 rounded-full bg-gray-100 p-2 text-sm text-black shadow-sm hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700`}
              disabled={isDownloading}
            >
              {isDownloading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border border-t-transparent dark:border-white/50 dark:border-t-transparent"></div>
                </div>
              )}
              <Download className="relative z-10 h-4 w-4" />
            </button>

            <button
              onClick={gotoHistoryClick}
              className="flex cursor-pointer items-center text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-400"
            >
              Purchases History
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

          {/* Products and Pricing Section */}
          <ProductItemsInfo products={purchase?.products} />

          {/* Approval & Metadata Section */}
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Approval Statuses
              </h2>
              <div className="space-y-4">
                <ApprovalStatus
                  label="HR Approval"
                  status={purchase.HR_Approval}
                />
                <ApprovalStatus
                  label="Credit Approval"
                  status={purchase.CC_Approval}
                />
                <ApprovalStatus
                  label="Invoicing Approval"
                  status={purchase.BI_Approval}
                />
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Deliver & Invoicing Details
              </h2>
              <div className="space-y-4">
                <DetailField
                  label="Invoicing Location"
                  value={purchase.invoicing_location}
                />
                <DetailField
                  label="Delivery/Pickup Details"
                  value={purchase.delivery_details}
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

                <DetailField
                  label="Credit Period"
                  value={formatCreditPeriod(purchase.user_credit_period)}
                />
              </div>
            </div>
          </div>

          {/* Payroll/HR Approval Section */}
          <div className="border-t border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
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
                status={purchase.HR_Approval || "n/a"}
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
          <div className="border-t border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
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
                  status={purchase.CC_Approval || "n/a"}
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
                  label="Credit Approval Date"
                  value={formatDateLong(purchase.cc_approval_date)}
                />
              </div>
            </div>
          </div>

          {/* Invoicing Details Section */}
          <div className="border-t border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
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
          <div className="border-t border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
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
                status={purchase.BI_Approval || "n/a"}
              />
              <DetailField
                label="Invoicing Approval Date"
                value={formatDateLong(purchase.bi_approval_date)}
              />
            </div>
          </div>
        </div>

        {/* Bottom Buttons - Centered */}
        <div className="mt-6 flex justify-center gap-4">
          {purchase.BI_Approval !== "approved" && userRole !== "staff" && (
            <button
              onClick={() => gotoPurchaseEdit(id)}
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
