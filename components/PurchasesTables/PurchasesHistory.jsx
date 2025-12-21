"use client";
import { useEffect, useState } from "react";
import TableSkeleton from "../skeletons/TableSkeleton";
import { LoadingBar } from "../Reusables/LoadingBar";
import PurchasesHistoryHeading from "../Reusables/Headings/PurchasesHistoryHeading";
import RecentPurchasesHeading from "../Reusables/Headings/RecentPurchasesHeading";
import { RecentActionButtons } from "../Reusables/ActionButtons/RecentActionButtons";
import { TableApprovalStatus } from "../Reusables/TableApprovalStatus";
import { UseHandleViewClick } from "@/utils/HandleActionClicks/UseHandleViewClick";
import { UseHandleEditClick } from "@/utils/HandleActionClicks/UseHandleEditClick";
import { formatDateLong } from "@/public/assets";
import Alert from "../Alert";
import Pagination from "../pagination/Pagination";
import ColumnToggle from "../Reusables/ColumnToggle";
import ImportExcelData from "../Reusables/Import/ImportExcelData";
import { useApprovalCounts } from "@/context/ApprovalCountsContext";
import { useApproversPurchases } from "@/context/ApproversPurchaseContext";
import { Search, SearchX } from "lucide-react";

export default function PurchasesHistory() {
  const [goingTo, setGoingTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Get purchases details from approversContext hook
  const {
    purchases,
    setPurchases,
    loading,
    fetchPurchases,
    fetchAllData,
    refetchDefaultPurchases,
  } = useApproversPurchases();

  // Get the refetch counts function
  const { refetchCounts } = useApprovalCounts();

  //Filter States
  const [filterType, setFilterType] = useState("staff");
  const [searchTerm, setSearchTerm] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [payrollNumber, setPayrollNumber] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [toDate, setToDate] = useState("");

  //Alert information state
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });

  //Toggling hiding columns
  const [visibleColumns, setVisibleColumns] = useState({
    submissionDate: true,
    termsOfPayment: true,
    mpesaCode: true,
    creditPeriod: true,
    payrollApproval: true,
    hrApproval: true,
    creditApproval: true,
    invoicingApproval: true,
  });

  //Handling column toggle
  const handleColumnToggle = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const handleEditClick = UseHandleEditClick();
  const handleViewClick = UseHandleViewClick();

  const gotoPurchaseEdit = (id) => {
    setGoingTo(id);
    handleEditClick(id);
  };

  const gotoPurchaseView = (id) => {
    setGoingTo(id);
    handleViewClick(id);
  };

  // Button click handler
  const applyFilters = () => {
    fetchPurchases({
      filterType,
      searchTerm,
      fromDate,
      toDate,
      approvalStatus,
      paymentTerms,
      payrollNumber,
      referenceNumber,
    });
    setCurrentPage(1); //set to first page on new search
  };

  //Function to return default purchases data and clear filters
  const fetchDefaultPurchases = () => {
    // Call refetch default purchases
    refetchDefaultPurchases();
    setCurrentPage(1);

    // Clear previous filters
    setSearchTerm("");
    setApprovalStatus("");
    setPaymentTerms("");
    setReferenceNumber("");
    setFromDate("");
    setToDate("");
    setPayrollNumber("");
  };

  // Recalculate total pages when purchases or rowsPerPage changes
  useEffect(() => {
    setTotalPages(Math.ceil(purchases.length / rowsPerPage));
  }, [rowsPerPage, purchases]);

  const currentPurchases = purchases.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  //Filtering out a deleted purchase from our current purchases state after deletion
  const handleDeleteSuccess = (deletedId, message) => {
    setPurchases((currentPurchases) =>
      currentPurchases.filter((purchase) => purchase.id !== deletedId),
    );
    setAlertInfo({
      show: true,
      type: "success",
      message: message || "Purchase Request Succesfully Deleted",
    });

    // Call the refetch function to refetch approval counts
    refetchCounts();
  };

  //Handler for deletion errors
  const handleDeleteError = (message) => {
    setAlertInfo({
      show: true,
      type: "error",
      message: message || "Error Deleting Purchase Request",
    });
  };

  return (
    <>
      {goingTo && <LoadingBar isLoading={true} />}

      {/* Alert Component for showing alerts from the recentAction delete functionality */}
      {alertInfo.show && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={() => setAlertInfo({ show: false, message: "", type: "" })}
        />
      )}
      <div className="rounded-xl px-2 pb-4">
        {/* Purchase History Heading or Recent Purchases Heading & toggling columns */}
        <div className="flex flex-col space-y-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          {fetchAllData ? (
            <PurchasesHistoryHeading />
          ) : (
            <RecentPurchasesHeading />
          )}
          <div className="flex items-center gap-4">
            <ImportExcelData
              exportAll={true}
              fromDate={fromDate}
              toDate={toDate}
            />
            <ColumnToggle
              visibleColumns={visibleColumns}
              onToggle={handleColumnToggle}
            />
          </div>
        </div>

        {/* Search Bar (Selecting filter types) */}
        <div className="mx-auto mb-6 max-w-md">
          <div className="mt-3 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="staff">Filter by Staff Name</option>
              <option value="reference">Filter by Reference Number</option>
              <option value="payroll">Filter by Payroll Number</option>
              <option value="date">Filter by Date</option>
              <option value="approval">Filter by Approval Status</option>
              <option value="terms">Filter by Payment Terms</option>
            </select>

            {filterType === "staff" && (
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            )}

            {filterType === "reference" && (
              <input
                type="text"
                placeholder="Enter reference number..."
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            )}

            {filterType === "payroll" && (
              <input
                type="text"
                placeholder="Enter payroll number..."
                value={payrollNumber}
                onChange={(e) => setPayrollNumber(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            )}

            {filterType === "date" && (
              <div className="mt-2 flex items-center space-x-2 sm:mt-0">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
            )}

            {filterType === "approval" && (
              <select
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </select>
            )}

            {filterType === "terms" && (
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              >
                <option value="" disabled>
                  Select terms
                </option>
                <option value="CASH">Cash</option>
                <option value="CREDIT">Credit</option>
                <option value="CASH AND CREDIT">Cash & Credit</option>
              </select>
            )}

            <div className="flex items-center gap-4">
              <button
                onClick={applyFilters}
                className="mt-2 flex items-center space-x-1 rounded-md bg-gray-900 px-3 py-1 text-sm text-white hover:bg-gray-700 sm:mt-0 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
              </button>
              <button
                onClick={fetchDefaultPurchases}
                className="mt-2 flex items-center space-x-1 rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-800 sm:mt-0 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-white"
              >
                <SearchX className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl">
              <table className="mb-6 min-w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    {visibleColumns.submissionDate && (
                      <th
                        className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                        title="Date Submitted"
                      >
                        Date Submitted
                      </th>
                    )}
                    <th
                      className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                      title="Reference Number"
                    >
                      Reference Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Staff
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Payroll
                    </th>
                    {visibleColumns.termsOfPayment && (
                      <th
                        className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                        title="Payment Terms"
                      >
                        Payment Terms
                      </th>
                    )}
                    {visibleColumns.mpesaCode && (
                      <th
                        className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                        title="Mpesa Code"
                      >
                        Mpesa Code
                      </th>
                    )}
                    {visibleColumns.creditPeriod && (
                      <th
                        className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                        title="Credit Period"
                      >
                        Credit Period
                      </th>
                    )}
                    {visibleColumns.payrollApproval && (
                      <th
                        className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                        title="Payroll Approval"
                      >
                        Payroll Approval
                      </th>
                    )}
                    {visibleColumns.hrApproval && (
                      <th
                        className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                        title="HR Approval"
                      >
                        HR Approval
                      </th>
                    )}
                    {visibleColumns.creditApproval && (
                      <th
                        className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                        title="Credit Approval"
                      >
                        Credit Approval
                      </th>
                    )}
                    {visibleColumns.invoicingApproval && (
                      <th
                        className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                        title="Invoicing Approval"
                      >
                        Invoicing Approval
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-sm font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-950">
                  {currentPurchases.length > 0 ? (
                    currentPurchases.map((purchase) => (
                      <tr
                        key={purchase.id}
                        className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-950 dark:even:bg-gray-900"
                      >
                        {visibleColumns.submissionDate && (
                          <td className="max-w-[200px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white">
                            {formatDateLong(purchase.createdAt)}
                          </td>
                        )}
                        <td
                          className="max-w-[200px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white"
                          title={purchase.reference_number}
                        >
                          {purchase.reference_number}
                        </td>
                        <td
                          className="max-w-[150px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white"
                          title={purchase.staffName}
                        >
                          {purchase.staffName}
                        </td>
                        <td className="max-w-[150px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white">
                          {purchase.payrollNo}
                        </td>
                        {visibleColumns.termsOfPayment && (
                          <td
                            className="max-w-[150px] truncate px-6 py-4 text-sm text-gray-900 dark:text-white"
                            title={purchase.employee_payment_terms}
                          >
                            {purchase.employee_payment_terms}
                          </td>
                        )}
                        {visibleColumns.mpesaCode && (
                          <td
                            className="px-6 py-4 text-sm text-gray-900 dark:text-white"
                            title={purchase.mpesa_code}
                          >
                            {purchase.mpesa_code || "N/A"}
                          </td>
                        )}
                        {visibleColumns.creditPeriod && (
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {purchase.user_credit_period || "N/A"}
                          </td>
                        )}
                        {visibleColumns.payrollApproval && (
                          <td className="px-6 py-4 text-sm">
                            <TableApprovalStatus
                              status={purchase.Payroll_Approval}
                            />
                          </td>
                        )}
                        {visibleColumns.hrApproval && (
                          <td className="px-6 py-4 text-sm">
                            <TableApprovalStatus
                              status={purchase.HR_Approval}
                            />
                          </td>
                        )}
                        {visibleColumns.creditApproval && (
                          <td className="px-6 py-4 text-sm">
                            <TableApprovalStatus
                              status={purchase.CC_Approval}
                            />
                          </td>
                        )}
                        {visibleColumns.invoicingApproval && (
                          <td className="px-6 py-4 text-sm">
                            <TableApprovalStatus
                              status={purchase.BI_Approval}
                            />
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <RecentActionButtons
                            id={purchase.id}
                            gotoPurchaseEdit={gotoPurchaseEdit}
                            gotoPurchaseView={gotoPurchaseView}
                            hrApproval={purchase.HR_Approval}
                            payrollApproval={purchase.Payroll_Approval}
                            ccApproval={purchase.CC_Approval}
                            biApproval={purchase.BI_Approval}
                            goingTo={goingTo}
                            onDeleteSuccess={handleDeleteSuccess}
                            onDeleteError={handleDeleteError}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="12"
                        className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
                      >
                        No purchase data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              handlePageChange={(page) => setCurrentPage(page)}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
