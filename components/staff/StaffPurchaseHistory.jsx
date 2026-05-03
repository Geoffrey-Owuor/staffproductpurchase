"use client";
import { Eye, MoreVertical, RotateCcw, Search, SearchX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import TableSkeleton from "../skeletons/TableSkeleton";
import { LoadingBar } from "../Reusables/LoadingBar";
import PurchasesHistoryHeading from "../Reusables/Headings/PurchasesHistoryHeading";
import RecentPurchasesHeading from "../Reusables/Headings/RecentPurchasesHeading";
import { TableApprovalStatus } from "../Reusables/TableApprovalStatus";
import Pagination from "../pagination/Pagination";
import { formatDateLong } from "@/public/assets";
import { useLoadingLineStore } from "@/store/useLoadingLineStore";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchStaffPurchases } from "@/utils/FetchPurchases/fetchStaffPurchases";

// ─── Constants ─────────────────────────────────────────────────────────────────

const APPROVAL_STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined",
};

const PAYMENT_TERMS_LABELS = {
  CASH: "Cash",
  CREDIT: "Credit",
};

// ─── Filter Pill Component ──────────────────────────────────────────────────────

function FilterPill({ label, value, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
      <span className="text-blue-500 dark:text-blue-400">{label}:</span>
      {value}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-blue-200 dark:hover:bg-blue-800"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function StaffPurchaseHistory({ fetchAllData = false }) {
  const router = useRouter();
  const [navigatingTo, setNavigatingTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const startLoading = useLoadingLineStore((state) => state.startLoading);

  // ── TanStack Query: fetch all data once ────────────────────────────────────────
  const {
    data: allPurchases = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["staffPurchases", fetchAllData],
    queryFn: () => fetchStaffPurchases(fetchAllData),
  });

  // ── Filter Input States (staging — not yet "applied") ──────────────────────────
  const [filterType, setFilterType] = useState("approval");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ── Active (applied) Filters — drive the useMemo ──────────────────────────────
  const [activeFilters, setActiveFilters] = useState({});
  // Shape: { fromDate?, toDate?, approval?, terms? }

  // ── Navigation ────────────────────────────────────────────────────────────────
  const handleViewClick = useCallback(
    (id) => {
      setNavigatingTo(id);
      router.push(`/staffdashboard/purchase-history/purchases/${id}`);
    },
    [router],
  );

  const handleTableRowClick = useCallback(
    (id) => {
      startLoading();
      router.push(`/staffdashboard/purchase-history/purchases/${id}`);
    },
    [router, startLoading],
  );

  // ── Client-side Filtering via useMemo ─────────────────────────────────────────
  const filteredPurchases = useMemo(() => {
    let result = allPurchases;

    if (activeFilters.fromDate && activeFilters.toDate) {
      const from = new Date(activeFilters.fromDate);
      const to = new Date(activeFilters.toDate);
      to.setHours(23, 59, 59, 999); // include the full toDate day
      result = result.filter((p) => {
        const d = new Date(p.createdAt);
        return d >= from && d <= to;
      });
    }

    if (activeFilters.approval) {
      const status = activeFilters.approval.toLowerCase();
      result = result.filter((p) => {
        const statuses = [
          p.Payroll_Approval,
          p.HR_Approval,
          p.CC_Approval,
          p.BI_Approval,
        ].map((s) => s?.toLowerCase());

        if (status === "pending")
          return statuses.some((s) => s === "pending" || !s);
        if (status === "approved")
          return statuses.every((s) => s === "approved");
        if (status === "declined")
          return statuses.some((s) => s === "declined");
        return true;
      });
    }

    if (activeFilters.terms) {
      result = result.filter(
        (p) => p.employee_payment_terms === activeFilters.terms,
      );
    }

    return result;
  }, [allPurchases, activeFilters]);

  // ── Pagination ────────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredPurchases.length / rowsPerPage);

  const currentPurchases = useMemo(
    () =>
      filteredPurchases.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      ),
    [filteredPurchases, currentPage, rowsPerPage],
  );

  // ── Apply Filters Handler ─────────────────────────────────────────────────────
  const applyFilters = useCallback(() => {
    const newFilters = {};

    if (filterType === "date" && fromDate && toDate) {
      newFilters.fromDate = fromDate;
      newFilters.toDate = toDate;
    } else if (filterType === "approval" && approvalStatus) {
      newFilters.approval = approvalStatus;
    } else if (filterType === "terms" && paymentTerms) {
      newFilters.terms = paymentTerms;
    }

    // Merge with existing active filters (overwrite same-key filters)
    setActiveFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, [filterType, fromDate, toDate, approvalStatus, paymentTerms]);

  // ── Remove a Single Filter Pill ───────────────────────────────────────────────
  const removeFilter = useCallback((key) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (key === "date") {
        delete next.fromDate;
        delete next.toDate;
      } else {
        delete next[key];
      }
      return next;
    });
    setCurrentPage(1);
  }, []);

  // ── Clear All Filters ─────────────────────────────────────────────────────────
  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    setApprovalStatus("");
    setPaymentTerms("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  }, []);

  // ── Build pill descriptors from activeFilters ─────────────────────────────────
  const filterPills = useMemo(() => {
    const pills = [];
    if (activeFilters.fromDate && activeFilters.toDate)
      pills.push({
        key: "date",
        label: "Date",
        value: `${activeFilters.fromDate} → ${activeFilters.toDate}`,
      });
    if (activeFilters.approval)
      pills.push({
        key: "approval",
        label: "Status",
        value:
          APPROVAL_STATUS_LABELS[activeFilters.approval] ??
          activeFilters.approval,
      });
    if (activeFilters.terms)
      pills.push({
        key: "terms",
        label: "Terms",
        value: PAYMENT_TERMS_LABELS[activeFilters.terms] ?? activeFilters.terms,
      });
    return pills;
  }, [activeFilters]);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl px-2 pb-4">
      {navigatingTo && <LoadingBar isLoading={true} />}

      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        {fetchAllData ? (
          <PurchasesHistoryHeading />
        ) : (
          <RecentPurchasesHeading />
        )}

        {/* Refetch Button */}
        <button
          onClick={() => refetch()}
          className="rounded-full bg-gray-100 p-2.5 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <RotateCcw className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Filter Controls — only shown in full history view */}
      {fetchAllData && (
        <div className="mx-auto mb-3 max-w-2xl">
          <div className="mt-3 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            {/* Filter type selector */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="date">Filter by Date</option>
              <option value="approval">Filter by Approval Status</option>
              <option value="terms">Filter by Payment Terms</option>
            </select>

            {/* Conditional inputs */}
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

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={applyFilters}
                className="mt-2 flex items-center space-x-1 rounded-md bg-gray-900 px-3 py-1 text-sm text-white hover:bg-gray-700 sm:mt-0 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
              </button>
              <button
                onClick={clearAllFilters}
                className="mt-2 flex items-center space-x-1 rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-800 sm:mt-0 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-white"
              >
                <SearchX className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Pills — only shown in full history view */}
      {fetchAllData && filterPills.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Active filters:
          </span>
          {filterPills.map((pill) => (
            <FilterPill
              key={pill.key}
              label={pill.label}
              value={pill.value}
              onRemove={() => removeFilter(pill.key)}
            />
          ))}
          {filterPills.length > 1 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-400 underline transition-colors hover:text-gray-600 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          )}
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
            {filteredPurchases.length} result
            {filteredPurchases.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <div className="py-10 text-center text-sm text-red-500">
          Failed to load purchases. Please try refreshing the page.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl">
            <table className="mb-6 min-w-full">
              <thead className="bg-gray-800 text-white">
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
                      className="transition-colors duration-200 odd:bg-white even:bg-gray-50 hover:cursor-pointer hover:bg-blue-50 dark:odd:bg-gray-950 dark:even:bg-gray-900 dark:hover:bg-[#1a2332]"
                      onClick={() => handleTableRowClick(purchase.id)}
                    >
                      <td className="max-w-[200px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white">
                        {formatDateLong(purchase.createdAt)}
                      </td>
                      <td
                        className="max-w-[200px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white"
                        title={purchase.reference_number}
                      >
                        <Link
                          href={`/staffdashboard/purchase-history/purchases/${purchase.id}`}
                          className="hover:text-blue-400 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            startLoading();
                          }}
                        >
                          {purchase.reference_number}
                        </Link>
                      </td>
                      <td
                        className="max-w-[150px] truncate px-6 py-4 text-sm text-gray-900 dark:text-white"
                        title={purchase.employee_payment_terms}
                      >
                        {purchase.employee_payment_terms}
                      </td>
                      <td
                        className="max-w-[150px] truncate px-6 py-4 text-sm text-gray-900 dark:text-white"
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewClick(purchase.id);
                            }}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50"
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
                      colSpan="12"
                      className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      {Object.keys(activeFilters).length > 0
                        ? "No purchases match the active filters."
                        : "No purchase data found"}
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
