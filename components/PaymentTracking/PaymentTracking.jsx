"use client";
import { useEffect, useState } from "react";
import TableSkeleton from "../skeletons/TableSkeleton";
import { LoadingBar } from "../Reusables/LoadingBar";
import { RecentActionButtons } from "../Reusables/ActionButtons/RecentActionButtons";
import { TableApprovalStatus } from "../Reusables/TableApprovalStatus";
import { UseHandleViewClick } from "@/utils/HandleActionClicks/UseHandleViewClick";
import { UseHandleEditClick } from "@/utils/HandleActionClicks/UseHandleEditClick";
import { formatDateLong } from "@/public/assets";
import Alert from "../Alert";
import Pagination from "../pagination/Pagination";

export default function PaymentTracking({ fetchAllData }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goingTo, setGoingTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //Filter States
  const [filterType, setFilterType] = useState("staff");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");

  //Alert information state
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });

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

  // New fetch function
  const fetchPurchases = async (options = {}) => {
    try {
      setLoading(true);

      let url = `/api/tablesdata/purchaseshistorydata?filterType=${options.filterType || filterType}`;

      //Telling the api if we should fetch all the data
      if (fetchAllData) {
        url += `&fetchAll=true`;
      }

      if (options.filterType === "staff" && options.searchTerm) {
        url += `&search=${encodeURIComponent(options.searchTerm)}`;
      } else if (
        options.filterType === "date" &&
        options.fromDate &&
        options.toDate
      ) {
        url += `&fromDate=${options.fromDate}&toDate=${options.toDate}`;
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
    fetchPurchases({ filterType: "staff" });
  }, []);

  // Button click handler
  const applyFilters = () => {
    fetchPurchases({
      filterType,
      searchTerm,
      fromDate,
      toDate,
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
      <div className="m-2 rounded-xl border border-gray-200 px-2 pt-2 pb-4 dark:border-gray-700 dark:bg-gray-950">
        {/* Table Heading */}
        <div className="mt-3 mb-2 px-1 pb-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Staff Payments Tracking
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tracking payments for all submitted purchase requests
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-4 max-w-md">
          <div className="flex items-center justify-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="staff">Filter by Staff Name</option>
              <option value="date">Filter by Date</option>
              <option value="terms">Filter by Payment Terms</option>
            </select>

            {filterType === "staff" && (
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2 rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-gray-500 focus:outline-none sm:mt-0 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            )}

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
        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <div>
              <table className="min-w-full">
                <thead className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Date Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Staff
                    </th>
                    <th className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold">
                      Payment Terms
                    </th>
                    <th className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold">
                      HR Approval
                    </th>
                    <th className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold">
                      Credit Approval
                    </th>
                    <th className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold">
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
                          className="max-w-[150px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white"
                          title={purchase.staffName}
                        >
                          {purchase.staffName}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                          {purchase.employee_payment_terms}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <TableApprovalStatus status={purchase.HR_Approval} />
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <TableApprovalStatus status={purchase.CC_Approval} />
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <TableApprovalStatus status={purchase.BI_Approval} />
                        </td>
                        <td className="px-6 py-4">
                          <RecentActionButtons
                            id={purchase.id}
                            gotoPurchaseEdit={gotoPurchaseEdit}
                            gotoPurchaseView={gotoPurchaseView}
                            biApproval={purchase.BI_Approval}
                            goingTo={goingTo}
                            disableDelete={true}
                          />
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
    </>
  );
}
