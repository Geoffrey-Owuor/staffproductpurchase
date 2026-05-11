"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TableSkeleton from "../skeletons/TableSkeleton";
import { LoadingBar } from "../Reusables/LoadingBar";
import { RecentActionButtons } from "../Reusables/ActionButtons/RecentActionButtons";
import { UseHandleViewClick } from "@/utils/HandleActionClicks/UseHandleViewClick";
import { UseHandleEditClick } from "@/utils/HandleActionClicks/UseHandleEditClick";
import { formatDateLong } from "@/public/assets";
import {
  PaymentStatus,
  TableApprovalStatus,
} from "../Reusables/TableApprovalStatus";
import Alert from "../Alert";
import Pagination from "../pagination/Pagination";
import ColumnToggle from "../Reusables/ColumnToggle";
import ImportExcelData from "../Reusables/Import/ImportExcelData";
import { FetchPeriodsPolicies } from "@/app/lib/FetchPeriodsPolicies";
import { RotateCcw, Search, SearchX, X } from "lucide-react";
import { useLoadingLineStore } from "@/store/useLoadingLineStore";
import Link from "next/link";
import { fetchPaymentTrackingPurchases } from "@/utils/FetchPurchases/fetchPaymentTrackingPurchases";

// ─── Constants ─────────────────────────────────────────────────────────────────

const PAYMENT_TERMS_LABELS = {
  CASH: "Cash",
  CREDIT: "Credit",
  "CASH AND CREDIT": "Cash & Credit",
};

const CLOSURE_LABELS = {
  open: "Open",
  closed: "Closed",
};

// ─── Filter Pill Component ──────────────────────────────────────────────────────

function FilterPill({ label, value, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
      <span className="font-semibold text-blue-500 dark:text-blue-400">
        {label}:
      </span>
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

export default function PaymentTracking() {
  const queryClient = useQueryClient();
  const [goingTo, setGoingTo] = useState(null);
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
    queryKey: ["paymentTracking"],
    queryFn: fetchPaymentTrackingPurchases,
  });

  // ── Fetch credit periods (static data, fetched once) ──────────────────────────
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    const fetchPeriods = async () => {
      const { periods } = await FetchPeriodsPolicies();
      setPeriods(periods);
    };
    fetchPeriods();
  }, []);

  // ── Filter Input States (staging — not yet "applied") ──────────────────────────
  const [filterType, setFilterType] = useState("staff");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [payrollNumber, setPayrollNumber] = useState("");
  const [monthPeriod, setMonthPeriod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [requestClosure, setRequestClosure] = useState("");

  // ── Active (applied) Filters — drive the useMemo ─────────────────────────────
  const [activeFilters, setActiveFilters] = useState({});
  // Shape: { staff?, reference?, payroll?, fromDate?, toDate?,
  //          terms?, period?, closure? }

  // ── Alert State ───────────────────────────────────────────────────────────────
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });

  // ── Column Visibility ─────────────────────────────────────────────────────────
  const [visibleColumns, setVisibleColumns] = useState({
    submissionDate: true,
    nameOfStaff: true,
    termsOfPayment: true,
    mpesaCode: true,
    creditPeriod: true,
    invoiceAmount: true,
  });

  const handleColumnToggle = (columnKey) => {
    setVisibleColumns((prev) => ({ ...prev, [columnKey]: !prev[columnKey] }));
  };

  const handleEditClick = UseHandleEditClick();
  const { handleViewClick, getViewPathName } = UseHandleViewClick();

  const gotoPurchaseEdit = (id) => {
    setGoingTo(id);
    handleEditClick(id);
  };
  const gotoPurchaseView = (id) => {
    setGoingTo(id);
    handleViewClick(id);
  };

  const handleTableRowClick = (id) => {
    startLoading();
    handleViewClick(id);
  };

  // ── Client-side Filtering via useMemo ─────────────────────────────────────────
  const filteredPurchases = useMemo(() => {
    let result = allPurchases;

    if (activeFilters.staff) {
      const term = activeFilters.staff.toLowerCase();
      result = result.filter((p) => p.staffName?.toLowerCase().includes(term));
    }

    if (activeFilters.reference) {
      const term = activeFilters.reference.toLowerCase();
      result = result.filter((p) =>
        p.reference_number?.toLowerCase().includes(term),
      );
    }

    if (activeFilters.payroll) {
      const term = activeFilters.payroll.toLowerCase();
      result = result.filter((p) => p.payrollNo?.toLowerCase().includes(term));
    }

    if (activeFilters.fromDate && activeFilters.toDate) {
      const from = new Date(activeFilters.fromDate);
      const to = new Date(activeFilters.toDate);
      to.setHours(23, 59, 59, 999); // include the full toDate day
      result = result.filter((p) => {
        const d = new Date(p.createdAt);
        return d >= from && d <= to;
      });
    }

    if (activeFilters.terms) {
      result = result.filter(
        (p) => p.employee_payment_terms === activeFilters.terms,
      );
    }

    if (activeFilters.period) {
      result = result.filter(
        (p) => p.user_credit_period === activeFilters.period,
      );
    }

    if (activeFilters.closure) {
      result = result.filter(
        (p) => p.request_closure?.toLowerCase() === activeFilters.closure,
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

    if (filterType === "staff" && searchTerm.trim()) {
      newFilters.staff = searchTerm.trim();
    } else if (filterType === "reference" && referenceNumber.trim()) {
      newFilters.reference = referenceNumber.trim();
    } else if (filterType === "payroll" && payrollNumber.trim()) {
      newFilters.payroll = payrollNumber.trim();
    } else if (filterType === "date" && fromDate && toDate) {
      newFilters.fromDate = fromDate;
      newFilters.toDate = toDate;
    } else if (filterType === "terms" && paymentTerms) {
      newFilters.terms = paymentTerms;
    } else if (filterType === "period" && monthPeriod) {
      newFilters.period = monthPeriod;
    } else if (filterType === "closure" && requestClosure) {
      newFilters.closure = requestClosure;
    }

    // Merge with existing active filters (overwrite same-key filters)
    setActiveFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, [
    filterType,
    searchTerm,
    referenceNumber,
    payrollNumber,
    fromDate,
    toDate,
    paymentTerms,
    monthPeriod,
    requestClosure,
  ]);

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
    setSearchTerm("");
    setPaymentTerms("");
    setReferenceNumber("");
    setRequestClosure("");
    setFromDate("");
    setToDate("");
    setMonthPeriod("");
    setPayrollNumber("");
    setCurrentPage(1);
  }, []);

  // ── Build pill descriptors from activeFilters ─────────────────────────────────
  const filterPills = useMemo(() => {
    const pills = [];
    if (activeFilters.staff)
      pills.push({ key: "staff", label: "Staff", value: activeFilters.staff });
    if (activeFilters.reference)
      pills.push({
        key: "reference",
        label: "Reference",
        value: activeFilters.reference,
      });
    if (activeFilters.payroll)
      pills.push({
        key: "payroll",
        label: "Payroll",
        value: activeFilters.payroll,
      });
    if (activeFilters.fromDate && activeFilters.toDate)
      pills.push({
        key: "date",
        label: "Date",
        value: `${activeFilters.fromDate} → ${activeFilters.toDate}`,
      });
    if (activeFilters.terms)
      pills.push({
        key: "terms",
        label: "Terms",
        value: PAYMENT_TERMS_LABELS[activeFilters.terms] ?? activeFilters.terms,
      });
    if (activeFilters.period) {
      // Look up the human-readable description from the fetched periods list
      const match = periods.find(
        (p) => p.period_value === activeFilters.period,
      );
      pills.push({
        key: "period",
        label: "Period",
        value: match?.period_description ?? activeFilters.period,
      });
    }
    if (activeFilters.closure)
      pills.push({
        key: "closure",
        label: "Closure",
        value: CLOSURE_LABELS[activeFilters.closure] ?? activeFilters.closure,
      });
    return pills;
  }, [activeFilters, periods]);

  // ── Close handlers ────────────────────────────────────────────────────────────
  const handleCloseSuccess = useCallback(
    (message) => {
      setAlertInfo({
        show: true,
        type: "success",
        message: message || "Request successfully closed",
      });
      // Invalidate to refetch fresh data reflecting the closure update
      queryClient.invalidateQueries({ queryKey: ["paymentTracking"] });
      queryClient.invalidateQueries({
        queryKey: ["TrackingApprovalCardCounts"],
      });
    },
    [queryClient],
  );

  const handleCloseError = useCallback((message) => {
    setAlertInfo({
      show: true,
      type: "error",
      message: message || "Error closing the request",
    });
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      {goingTo && <LoadingBar isLoading={true} />}

      {alertInfo.show && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={() => setAlertInfo({ show: false, message: "", type: "" })}
        />
      )}

      <div className="rounded-xl px-2 pb-4">
        {/* Heading & toolbar */}
        <div className="flex flex-col space-y-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="mt-3 mb-2 px-1 pb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fully Approved Requests
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Purchase requests approved by all approvers
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Refetch Button */}
            <button
              onClick={() => refetch()}
              className="rounded-full bg-gray-100 p-2.5 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <RotateCcw className="h-4.5 w-4.5" />
            </button>
            <ImportExcelData fromDate={fromDate} toDate={toDate} />
            <ColumnToggle
              visibleColumns={visibleColumns}
              onToggle={handleColumnToggle}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mx-auto mb-3 max-w-2xl">
          <div className="mt-3 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            {/* Filter type selector */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="staff">Filter by Staff Name</option>
              <option value="reference">Filter by Reference Number</option>
              <option value="payroll">Filter by Payroll Number</option>
              <option value="date">Filter by Date</option>
              <option value="closure">Filter by Request Closure</option>
              <option value="period">Filter by Credit Period</option>
              <option value="terms">Filter by Payment Terms</option>
            </select>

            {/* Conditional inputs */}
            {filterType === "staff" && (
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="mt-2 rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-gray-500 focus:outline-none sm:mt-0 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            )}

            {filterType === "reference" && (
              <input
                type="text"
                placeholder="Enter reference number..."
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="mt-2 rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-gray-500 focus:outline-none sm:mt-0 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            )}

            {filterType === "payroll" && (
              <input
                type="text"
                placeholder="Enter payroll number..."
                value={payrollNumber}
                onChange={(e) => setPayrollNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="mt-2 rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-gray-500 focus:outline-none sm:mt-0 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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

            {filterType === "period" && (
              <select
                value={monthPeriod}
                onChange={(e) => setMonthPeriod(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              >
                <option value="" disabled>
                  Select period
                </option>
                {periods.map((period) => (
                  <option key={period.period_value} value={period.period_value}>
                    {period.period_description}
                  </option>
                ))}
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
                <option value="CASH AND CREDIT">Cash &amp; Credit</option>
              </select>
            )}

            {filterType === "closure" && (
              <select
                value={requestClosure}
                onChange={(e) => setRequestClosure(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              >
                <option value="" disabled>
                  Select option
                </option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={applyFilters}
                className="mt-2 flex items-center space-x-1 rounded-md bg-gray-900 px-3 py-1 text-sm text-white hover:bg-gray-700 sm:mt-0 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-300"
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

        {/* Active Filter Pills */}
        {filterPills.length > 0 && (
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
                    {visibleColumns.nameOfStaff && (
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Staff
                      </th>
                    )}
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
                    {visibleColumns.invoiceAmount && (
                      <th
                        className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                        title="Invoice Amount"
                      >
                        Invoice Amount
                      </th>
                    )}
                    <th
                      className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                      title="Invoicing Approval"
                    >
                      Invoicing Approval
                    </th>
                    <th
                      className="max-w-[130px] truncate px-6 py-3 text-left text-sm font-semibold"
                      title="Request Closure"
                    >
                      Request Closure
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
                        {visibleColumns.submissionDate && (
                          <td className="max-w-[200px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white">
                            {formatDateLong(purchase.createdAt)}
                          </td>
                        )}
                        <td
                          className="max-w-[200px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white"
                          title={purchase.reference_number}
                        >
                          <Link
                            href={getViewPathName(purchase.id)}
                            className="hover:text-blue-400 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              startLoading();
                            }}
                          >
                            {purchase.reference_number}
                          </Link>
                        </td>
                        {visibleColumns.nameOfStaff && (
                          <td
                            className="max-w-[150px] overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-900 dark:text-white"
                            title={purchase.staffName}
                          >
                            {purchase.staffName}
                          </td>
                        )}
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
                            className="max-w-[150px] truncate px-6 py-4 text-sm text-gray-900 dark:text-white"
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
                        {visibleColumns.invoiceAmount && (
                          <td className="text-sm">
                            <div className="mr-3 rounded-xl border border-gray-300 px-6 py-2 dark:border-gray-600">
                              {purchase.invoice_amount || "N/A"}
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm">
                          <TableApprovalStatus
                            status={purchase.BI_Approval || "N/A"}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <PaymentStatus
                            status={purchase.request_closure || "N/A"}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <RecentActionButtons
                            id={purchase.id}
                            gotoPurchaseEdit={gotoPurchaseEdit}
                            gotoPurchaseView={gotoPurchaseView}
                            ccApproval={purchase.CC_Approval}
                            hrApproval={purchase.HR_Approval}
                            payrollApproval={purchase.Payroll_Approval}
                            biApproval={purchase.BI_Approval}
                            goingTo={goingTo}
                            closeButton={true}
                            closureValue={purchase.request_closure}
                            onCloseSuccess={handleCloseSuccess}
                            onCloseError={handleCloseError}
                            disableDelete={true}
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
    </>
  );
}
