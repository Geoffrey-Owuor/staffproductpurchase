"use client";

//List of Columns that can be toggled
const toggleableColumns = [
  { key: "hrApproval", label: "HR Approval" },
  { key: "creditApproval", label: "Credit Approval" },
  { key: "invoicingApproval", label: "Invoicing Approval" },
];

export default function ColumnToggle({ visibleColumns, onToggle }) {
  return (
    <div className="mb-4 flex items-center justify-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Show/Hide Columns:
      </span>
      {toggleableColumns.map((column) => (
        <button
          key={column.key}
          onClick={() => onToggle(column.key)}
          className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            visibleColumns[column.key]
              ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          {column.label}
        </button>
      ))}
    </div>
  );
}
