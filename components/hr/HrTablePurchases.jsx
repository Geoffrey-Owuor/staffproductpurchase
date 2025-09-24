"use client";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TableSkeleton from "../skeletons/TableSkeleton";
import { LoadingBar } from "../Reusables/LoadingBar";
import RecentPurchasesHeading from "../Reusables/Headings/RecentPurchasesHeading";
import { RecentActionButtons } from "../Reusables/RecentActionButtons/RecentActionButtons";
import { TableApprovalStatus } from "../Reusables/TableApprovalStatus";
import useDebounce from "../Reusables/Debouncing/useDebounce";

export default function HrTablePurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState(null);
  const [goingTo, setGoingTo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const router = useRouter();

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const handleViewClick = (id) => {
    setNavigatingTo(id);
    router.push(`/hrdashboard/requests-history/requests/${id}`);
  };

  const handleEditClick = (id) => {
    setGoingTo(id);
    router.push(`/hrdashboard/requests-history/requests/${id}/edit`);
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const url = `/api/hr/hrtablepurchases${debouncedSearchTerm ? `?search=${encodeURIComponent(debouncedSearchTerm)}` : ""}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch purchases");
        }

        if (!Array.isArray(data)) {
          console.warn("Data is not an array:", data);
          setPurchases([]);
        } else {
          setPurchases(data);
        }
      } catch (err) {
        console.error("Error fetching purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [debouncedSearchTerm]);

  // Recalculate total pages when purchases or rowsPerPage changes
  useEffect(() => {
    setTotalPages(Math.ceil(purchases.length / rowsPerPage));
    setCurrentPage(1); // Optional: Reset to first page when rows per page changes
  }, [rowsPerPage, purchases]);

  const currentPurchases = purchases.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShowPageDropdown(false);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`mx-1 flex h-8 w-8 items-center justify-center rounded-full ${currentPage === i ? "bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900" : "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"}`}
          >
            {i}
          </button>,
        );
      }
    } else {
      for (let i = 1; i <= 3; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`mx-1 flex h-8 w-8 items-center justify-center rounded-full ${currentPage === i ? "bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900" : "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"}`}
          >
            {i}
          </button>,
        );
      }

      pages.push(
        <div key="dropdown" className="relative mx-1">
          <button
            onClick={() => setShowPageDropdown(!showPageDropdown)}
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {showPageDropdown && (
            <div className="absolute top-full left-0 z-10 mt-1 w-16 rounded-lg bg-white shadow-lg dark:bg-gray-950">
              {Array.from({ length: totalPages - 4 }, (_, i) => i + 4).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`block w-full px-3 py-1 text-center text-sm ${currentPage === page ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white" : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"}`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
          )}
        </div>,
      );

      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`mx-1 flex h-8 w-8 items-center justify-center rounded-full ${currentPage === totalPages ? "bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900" : "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"}`}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className="m-2 rounded-xl border border-gray-200 px-2 pt-2 pb-4 dark:border-gray-700 dark:bg-gray-950">
      {(navigatingTo || goingTo) && <LoadingBar isLoading={true} />}

      {/* Heading */}
      <RecentPurchasesHeading />

      {/* Search Bar */}
      <div className="mx-auto mt-6 mb-4 max-w-md">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 placeholder-gray-500 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder-gray-400"
            placeholder="Search by employee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <svg
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
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
                        handleEditClick={handleEditClick}
                        handleViewClick={handleViewClick}
                        biApproval={purchase.bi_approval}
                        navigatingTo={navigatingTo}
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
                    {debouncedSearchTerm
                      ? "No purchases found matching your search."
                      : "No recent purchases available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 mb-1 flex items-center justify-center space-x-7">
            {/* Rows Per Page Drop Down */}
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-700 dark:text-gray-400">
                Rows per page:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing rows per page
                }}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            {purchases.length > rowsPerPage && (
              <div className="flex items-center">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="mx-1 flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-900 hover:bg-gray-100 disabled:opacity-50 dark:text-white dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {renderPageNumbers()}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="mx-1 flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-900 hover:bg-gray-100 disabled:opacity-50 dark:text-white dark:hover:bg-gray-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
