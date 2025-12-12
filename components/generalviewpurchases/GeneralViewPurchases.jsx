"use client";
import { Edit, X, Download, View, GitPullRequestClosed } from "lucide-react";
import ApprovalStatus from "../Reusables/ApprovalStatus";
import { AnimatePresence } from "framer-motion";
import TopBarButtons from "../Reusables/TopBarButtons/TopBarButtons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PurchaseDetailSkeleton from "../skeletons/PurchaseDetailsSkeleton";
import DetailField from "../Reusables/DetailField";
import { generateClientPDF } from "@/utils/returnPurchasePDF";
import { LoadingBar } from "../Reusables/LoadingBar";
import { formatDateLong } from "@/public/assets";
import { UseHandleEditClick } from "@/utils/HandleActionClicks/UseHandleEditClick";
import ProductItemsInfo from "../ProductItemsInfo/ProductItemsInfo";
import { usePurchase } from "@/context/PurchaseDetailsContext";
import { useUser } from "@/context/UserContext";
import { formatCreditPeriod } from "@/public/assets";
import ConfirmationDialog from "../Reusables/ConfirmationDialog";
import Alert from "../Alert";
import { LoadingBarWave } from "../Reusables/LoadingBar";
import { useTrackingApprovalCards } from "@/context/TrackingApprovalCardsContext";

export default function GeneralViewPurchases({ id }) {
  const { role: userRole } = useUser();
  const { refetchCounts } = useTrackingApprovalCards();
  const { purchase, loading, error, refetchPurchaseDetails } = usePurchase();
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleConfirmClose = () => {
    setShowConfirmationDialog(true);
  };

  const handleUpdateClose = async () => {
    setShowConfirmationDialog(false);
    setUpdating(true);
    try {
      const response = await fetch(`/api/closepurchase/${id}`, {
        method: "PUT",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error closing Purchase Request");
      }
      setAlertType("success");
      setAlertMessage(result.message || "Purchase request closed successfully");
      setShowAlert(true);
      refetchCounts();
    } catch (error) {
      console.error("Error Closing Purchase Request:", error);
      setAlertType("error");
      setAlertMessage(error.message || "Error closing the purchase request");
      setShowAlert(true);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    // Ensures the component always shows up-to-date data
    refetchPurchaseDetails();
  }, [refetchPurchaseDetails]);

  const router = useRouter();

  //Generate pdf document version of the data
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateClientPDF({
        purchaseData: purchase,
        products: purchase.products || [],
        createdAt: purchase.createdAt,
        reference: purchase.reference_number,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEditClick = UseHandleEditClick();

  const gotoPurchaseEdit = (id) => {
    setIsEditing(true);
    handleEditClick(id);
  };

  const handleCloseClick = () => {
    setIsClosing(true);
    router.back();
  };

  if (loading) {
    return <PurchaseDetailSkeleton />;
  }

  if (error) {
    return (
      <>
        <div className="mx-auto p-6 text-center dark:bg-gray-950">
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-white">
            Error: {error}
          </div>
          <TopBarButtons />
        </div>
      </>
    );
  }

  if (!purchase || purchase.length === 0) {
    return (
      <>
        <div className="mx-auto p-6 text-center dark:bg-gray-950">
          <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-700 dark:bg-yellow-900 dark:text-white">
            No purchase data found
          </div>
          <TopBarButtons />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto p-2">
        {isEditing && <LoadingBar isLoading={true} />}
        {/* Header with back button */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <View className="h-6 w-6" />
            <span className="text-xl font-semibold">View Request</span>
          </div>
          <div className="flex items-center justify-end gap-4">
            {/* Middle Edit Button */}
            {((userRole === "payroll" &&
              purchase.Payroll_Approval !== "approved" &&
              purchase.Payroll_Approval !== "declined") ||
              (userRole === "hr" &&
                purchase.HR_Approval !== "approved" &&
                purchase.HR_Approval !== "declined" &&
                purchase.Payroll_Approval !== "declined") ||
              (userRole === "cc" &&
                purchase.CC_Approval !== "approved" &&
                purchase.CC_Approval !== "declined" &&
                purchase.Payroll_Approval !== "declined" &&
                purchase.HR_Approval !== "declined") ||
              (userRole === "bi" &&
                purchase.BI_Approval !== "approved" &&
                purchase.BI_Approval !== "declined" &&
                purchase.Payroll_Approval !== "declined" &&
                purchase.HR_Approval !== "declined" &&
                purchase.CC_Approval !== "declined")) &&
              userRole !== "staff" && (
                <button
                  onClick={() => gotoPurchaseEdit(id)}
                  disabled={isEditing}
                  className="flex items-center justify-center gap-1 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              )}

            <button
              onClick={handleDownload}
              className={`relative flex items-center justify-center gap-1 rounded-full bg-gray-800 p-2 text-sm text-white shadow-sm hover:bg-gray-700`}
              disabled={isDownloading}
            >
              {isDownloading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border border-t-transparent dark:border-white/50 dark:border-t-transparent"></div>
                </div>
              )}
              <Download className="relative z-10 h-4 w-4" />
            </button>
            {/* Top bar buttons */}
            <TopBarButtons />
          </div>
        </div>

        {/* Details Card */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700">
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
                  label="Payroll Approval"
                  status={purchase.Payroll_Approval}
                />
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
                Delivery & Invoicing Details
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
                <DetailField
                  label="Reference Number"
                  value={purchase.reference_number}
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

                {(purchase.employee_payment_terms === "CREDIT" ||
                  purchase.employee_payment_terms === "CASH AND CREDIT") && (
                  <DetailField
                    label="Credit Period"
                    value={formatCreditPeriod(purchase.user_credit_period)}
                  />
                )}
                {(purchase.employee_payment_terms === "CASH" ||
                  purchase.employee_payment_terms === "CASH AND CREDIT") && (
                  <DetailField label="Mpesa Code" value={purchase.mpesa_code} />
                )}
              </div>
            </div>
          </div>

          {/* Payroll Approval Section - Just the same 1/3 rule in credit control */}
          <div className="border-t border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Payroll Approval
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <DetailField
                  label="1/3 Rule Assessment"
                  value={purchase.one_third_rule || "n/a"}
                />
              </div>

              <DetailField
                label="Payroll Approver"
                value={purchase.payroll_approver_name}
              />
              <DetailField
                label="Payroll Approval Date"
                value={formatDateLong(purchase.payroll_approval_date)}
              />
              <ApprovalStatus
                label="Payroll Approval Status"
                status={purchase.Payroll_Approval || "n/a"}
              />
            </div>
          </div>

          {/* HR Approval Section */}
          <div className="border-t border-gray-200 p-6 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              HR Approval
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
                label="HR Approval Status"
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
                  label="Credit Approval Status"
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
                label="Invoice Amount"
                value={
                  purchase.invoice_amount
                    ? `Ksh ${Number(purchase.invoice_amount).toFixed(2)}`
                    : "n/a"
                }
              />
              <DetailField
                label="Reference Details"
                value={purchase.payment_reference || "n/a"}
              />
              <ApprovalStatus
                label="Invoicing Approval Status"
                status={purchase.BI_Approval || "n/a"}
              />

              <DetailField
                label="Invoiced By"
                value={purchase.bi_approver_name || "n/a"}
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
          {((userRole === "payroll" &&
            purchase.Payroll_Approval !== "approved" &&
            purchase.Payroll_Approval !== "declined") ||
            (userRole === "hr" &&
              purchase.HR_Approval !== "approved" &&
              purchase.HR_Approval !== "declined" &&
              purchase.Payroll_Approval !== "declined") ||
            (userRole === "cc" &&
              purchase.CC_Approval !== "approved" &&
              purchase.CC_Approval !== "declined" &&
              purchase.Payroll_Approval !== "declined" &&
              purchase.HR_Approval !== "declined") ||
            (userRole === "bi" &&
              purchase.BI_Approval !== "approved" &&
              purchase.BI_Approval !== "declined" &&
              purchase.Payroll_Approval !== "declined" &&
              purchase.HR_Approval !== "declined" &&
              purchase.CC_Approval !== "declined")) &&
            userRole !== "staff" && (
              <button
                onClick={() => gotoPurchaseEdit(id)}
                disabled={isEditing}
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
            )}
          <button
            onClick={handleCloseClick}
            disabled={isClosing}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
            Close
          </button>
          {userRole === "cc" && purchase.BI_Approval === "approved" && (
            <button
              disabled={updating}
              onClick={handleConfirmClose}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
            >
              <GitPullRequestClosed className="mr-1 h-4 w-4" />
              Mark as closed
            </button>
          )}
        </div>
      </div>

      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}

      <AnimatePresence>
        {showConfirmationDialog && (
          <ConfirmationDialog
            message="Are you sure you want to close this purchase request? (You cannot reopen after closing)"
            onConfirm={handleUpdateClose}
            onCancel={() => setShowConfirmationDialog(false)}
            title="Close Purchase Request"
          />
        )}
      </AnimatePresence>

      <LoadingBarWave isLoading={updating} />
    </>
  );
}
