"use client";
import { Eye, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TableSkeleton from "../skeletons/TableSkeleton";
import { LoadingBar } from "../Reusables/LoadingBar";
import PurchasesHistoryHeading from "../Reusables/Headings/PurchasesHistoryHeading";
import RecentPurchasesHeading from "../Reusables/Headings/RecentPurchasesHeading";
import { TableApprovalStatus } from "../Reusables/TableApprovalStatus";
import Pagination from "../pagination/Pagination";
import { formatDateLong } from "@/public/assets";

export default function StaffPurchaseHistory({ fetchAllData }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();

  //Filters
  const [filterType, setFilterType] = useState("approval");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleViewClick = (id) => {
    setNavigatingTo(id);
    router.push(`/staffdashboard/purchase-history/purchases/${id}`);
  };

  // New fetch function
  const fetchPurchases = async (options = {}) => {
    try {
      setLoading(true);

      let url = `/api/staffpurchaseshistory?filterType=${options.filterType || filterType}`;

      //Telling the api if we should fetch all the data
      if (fetchAllData) {
        url += `&fetchAll=true`;
      }

      if (options.filterType === "date" && options.fromDate && options.toDate) {
        url += `&fromDate=${options.fromDate}&toDate=${options.toDate}`;
      } else if (options.filterType === "approval" && options.approvalStatus) {
        url += `&approvalStatus=${options.approvalStatus}`;
      } else if (options.filterType === "terms" && options.paymentTerms) {
        url += `&paymentTerms=${options.paymentTerms}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to fetch purchases");
      setPurchases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch (unfiltered purchases)
  useEffect(() => {
    fetchPurchases({ filterType: "approval" });
  }, []);

  // Button click handler
  const applyFilters = () => {
    fetchPurchases({
      filterType,
      fromDate,
      toDate,
      approvalStatus,
      paymentTerms,
    });
  };

  // Recalculate total pages when purchases or rowsPerPage changes
  useEffect(() => {
    setTotalPages(Math.ceil(purchases.length / rowsPerPage));
    setCurrentPage(1); // Optional: Reset to first page when rows per page changes
  }, [rowsPerPage, purchases]);

  const currentPurchases = purchases.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <div className="m-2 rounded-xl border border-gray-200 px-2 pt-2 pb-4 dark:border-gray-700 dark:bg-gray-950">
      {navigatingTo && <LoadingBar isLoading={true} />}
      {/* Purchases history heading or recent purchases heading*/}

      {fetchAllData ? <PurchasesHistoryHeading /> : <RecentPurchasesHeading />}

      {/* Search Bar */}
      {fetchAllData && (
        <div className="mx-auto mb-6 max-w-md">
          <div className="mt-3 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="date">Filter by Date</option>
              <option value="approval">Filter by Approval Status</option>
              <option value="terms">Filter by Payment Terms</option>
            </select>

            {filterType === "date" && (
              <div className="mt-2 flex items-center space-x-2 sm:mt-0">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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
              </select>
            )}

            <button
              onClick={applyFilters}
              className="mt-2 rounded-md bg-gray-900 px-3 py-1 text-sm text-white hover:bg-gray-700 sm:mt-0 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="mb-6 min-w-full">
              <thead className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
                <tr>
                  <th
                    className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                    title="Date Submitted"
                  >
                    Date Submitted
                  </th>
                  <th
                    className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                    title="Reference Number"
                  >
                    Reference Number
                  </th>
                  <th
                    className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                    title="Payment Terms"
                  >
                    Payment Terms
                  </th>
                  <th
                    className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                    title="Mpesa Code"
                  >
                    Mpesa Code
                  </th>
                  <th
                    className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                    title="Credit Period"
                  >
                    Credit Period
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    PayrollNo
                  </th>
                  <th
                    className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                    title="Invoicing Location"
                  >
                    Invoicing Location
                  </th>
                  <th
                    className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                    title="Payroll Approval"
                  >
                    Payroll Approval
                  </th>
                  <th
                    className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                    title="HR Approval"
                  >
                    HR Approval
                  </th>
                  <th
                    className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                    title="Credit Approval"
                  >
                    Credit Approval
                  </th>
                  <th
                    className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                    title="Invoicing Approval"
                  >
                    Invoicing Approval
                  </th>
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
                      <td className="max-w-[200px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white">
                        {formatDateLong(purchase.createdAt)}
                      </td>
                      <td
                        className="max-w-[200px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white"
                        title={purchase.reference_number}
                      >
                        {purchase.reference_number}
                      </td>
                      <td
                        className="max-w-[150px] truncate px-6 py-4 text-sm text-gray-900 dark:text-white"
                        title={purchase.employee_payment_terms}
                      >
                        {purchase.employee_payment_terms}
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-900 dark:text-white"
                        title={purchase.mpesa_code}
                      >
                        {purchase.mpesa_code || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {purchase.user_credit_period || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {purchase.payrollNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {purchase.invoicing_location}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <TableApprovalStatus
                          status={purchase.Payroll_Approval}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <TableApprovalStatus status={purchase.HR_Approval} />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <TableApprovalStatus status={purchase.CC_Approval} />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <TableApprovalStatus status={purchase.BI_Approval} />
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                        <div className="group ml-1.5 flex">
                          <button
                            onClick={() => handleViewClick(purchase.id)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                            title="View"
                            disabled={navigatingTo === purchase.id}
                          >
                            <MoreVertical className="hidden h-4 w-4 md:block md:group-hover:hidden" />
                            <Eye className="h-4 w-4 md:hidden md:group-hover:block" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
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
  );
}
