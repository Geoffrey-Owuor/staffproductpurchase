"use client";
import { useEffect, useState } from "react";
import TableSkeleton from "../skeletons/TableSkeleton";
import { LoadingBar } from "../Reusables/LoadingBar";
import RecentPurchasesHeading from "../Reusables/Headings/RecentPurchasesHeading";
import { RecentActionButtons } from "../Reusables/RecentActionButtons/RecentActionButtons";
import { TableApprovalStatus } from "../Reusables/TableApprovalStatus";
import { UseHandleEditClick } from "@/utils/HandleActionClicks/UseHandleEditClick";
import { UseHandleViewClick } from "@/utils/HandleActionClicks/UseHandleViewClick";
import Pagination from "../pagination/Pagination";

export default function RecentPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goingTo, setGoingTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  //Added States
  const [filterType, setFilterType] = useState("staff");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // New fetch function
  const fetchPurchases = async (options = {}) => {
    try {
      setLoading(true);

      let url = `/api/tablesdata/recentpurchasesdata?filterType=${options.filterType || filterType}`;

      if (options.filterType === "staff" && options.searchTerm) {
        url += `&search=${encodeURIComponent(options.searchTerm)}`;
      } else if (
        options.filterType === "date" &&
        options.fromDate &&
        options.toDate
      ) {
        url += `&fromDate=${options.fromDate}&toDate=${options.toDate}`;
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
    fetchPurchases({ filterType, searchTerm, fromDate, toDate });
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
      {goingTo && <LoadingBar isLoading={true} />}

      {/* Heading */}
      <RecentPurchasesHeading />

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
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Payroll
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  HR Approval
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  CC Approval
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  BI Approval
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
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
                      {purchase.itemname}
                    </td>
                    <td className="max-w-[150px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white">
                      {purchase.staffname}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                      {purchase.payrollno}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <TableApprovalStatus status={purchase.hr_approval} />
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <TableApprovalStatus status={purchase.cc_approval} />
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <TableApprovalStatus status={purchase.bi_approval} />
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                      <RecentActionButtons
                        id={purchase.id}
                        gotoPurchaseEdit={gotoPurchaseEdit}
                        gotoPurchaseView={gotoPurchaseView}
                        biApproval={purchase.bi_approval}
                        goingTo={goingTo}
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
        </div>
      )}
    </div>
  );
}
