"use-client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Columns2 } from "lucide-react";

//Master List
const allPossibleColumns = [
  { key: "submissionDate", label: "Date Submitted" },
  { key: "nameOfStaff", label: "Staff" },
  { key: "termsOfPayment", label: "Payment Terms" },
  { key: "mpesaCode", label: "Mpesa Code" },
  { key: "creditPeriod", label: "Credit Period" },
  { key: "payrollApproval", label: "Payroll Approval" },
  { key: "hrApproval", label: "HR Approval" },
  { key: "creditApproval", label: "Credit Approval" },
  { key: "invoicingApproval", label: "Invoicing Approval" },
  { key: "invoiceAmount", label: "Invoice Amount" },
];

export default function ColumnToggle({ visibleColumns, onToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter the columns to only include those present in the visibleColumns prop
  const availableColumnsToToggle = allPossibleColumns.filter((column) =>
    Object.keys(visibleColumns).includes(column.key),
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Columns2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        Show/Hide Columns
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md border border-gray-300 bg-white shadow-lg focus:outline-none dark:border-gray-600 dark:bg-gray-800">
          <div className="p-2">
            {/* mapping over the filtered list */}
            {availableColumnsToToggle.map((column) => (
              <button
                key={column.key}
                onClick={() => onToggle(column.key)}
                className="flex w-full cursor-pointer items-center space-x-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {/* Conditional Lucide Icon for visual representation */}
                {visibleColumns[column.key] ? (
                  <Check className="h-4 w-4 text-gray-900 dark:text-white" />
                ) : (
                  <X className="h-4 w-4 text-gray-900 dark:text-white" />
                )}
                <span>{column.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
