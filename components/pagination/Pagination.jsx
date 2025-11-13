import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Pagination({
  totalPages,
  currentPage,
  rowsPerPage,
  onRowsPerPageChange,
  handlePageChange,
}) {
  const [showPageDropdown, setShowPageDropdown] = useState(false);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`mx-1 flex h-6 w-6 items-center justify-center rounded-full ${currentPage === i ? "bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900" : "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"}`}
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
            className={`mx-1 flex h-6 w-6 items-center justify-center rounded-full ${currentPage === i ? "bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900" : "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"}`}
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
                    onClick={() => {
                      handlePageChange(page);
                      setShowPageDropdown(false);
                    }}
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
          className={`mx-1 flex h-6 w-6 items-center justify-center rounded-full ${currentPage === totalPages ? "bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900" : "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"}`}
        >
          {totalPages}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="mt-4 mb-1 flex items-center justify-center space-x-2">
      {/* Rows Per Page Drop Down */}
      <div className="flex items-center">
        <span className="mr-2 hidden text-sm text-gray-700 md:flex dark:text-gray-400">
          Rows:
        </span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            onRowsPerPageChange(Number(e.target.value));
          }}
          className="rounded-md border border-gray-300 bg-white p-1 text-sm text-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      {totalPages > 1 && (
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
  );
}
