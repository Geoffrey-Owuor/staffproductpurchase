import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

export default function Pagination({
  totalPages,
  currentPage,
  rowsPerPage,
  onRowsPerPageChange,
  handlePageChange,
}) {
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const dropDownRef = useRef(null);

  // useEffect that listens to clicking outside of the dropdown menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setShowPageDropdown(false);
      }
    };

    // Only run if showPagedropdown is true
    if (showPageDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPageDropdown]);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`mx-1 flex h-6 w-6 items-center justify-center rounded-[7px] ${currentPage === i ? "bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900" : "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"}`}
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
            className={`mx-1 flex h-6 w-6 items-center justify-center rounded-[7px] ${currentPage === i ? "bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900" : "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"}`}
          >
            {i}
          </button>,
        );
      }

      // Show current page if it is in the drop-down range
      {
        currentPage > 3 &&
          currentPage < totalPages &&
          pages.push(
            <button
              key={currentPage}
              onClick={() => handlePageChange(currentPage)}
              className="mx-1 flex h-6 w-fit min-w-6 items-center justify-center rounded-[7px] bg-gray-900 px-1 text-white dark:bg-gray-200 dark:text-gray-900"
            >
              {currentPage}
            </button>,
          );
      }

      pages.push(
        <div key="dropdown" className="relative mx-1" ref={dropDownRef}>
          <button
            onClick={() => setShowPageDropdown(!showPageDropdown)}
            className={`flex h-8 w-8 items-center justify-center rounded-[7px] bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <AnimatePresence>
            {showPageDropdown && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="absolute bottom-full left-0 z-10 mb-1 max-h-40 w-fit min-w-20 overflow-auto rounded-lg border border-gray-200 bg-gray-100 p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {Array.from({ length: totalPages - 4 }, (_, i) => i + 4).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => {
                        handlePageChange(page);
                        setShowPageDropdown(false);
                      }}
                      className={`mb-0.5 block w-full rounded-[7px] py-1 pr-1 pl-3 text-start text-sm ${currentPage === page ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white" : "text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"}`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
      );
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`mx-1 flex h-6 w-fit min-w-6 items-center justify-center rounded-[7px] px-1 ${currentPage === totalPages ? "bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900" : "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"}`}
        >
          {totalPages}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="mt-4 mb-1">
      {/* Mobile Pagination */}
      <div className="flex items-center justify-between px-1 sm:hidden">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-lg bg-gray-200 px-3 py-2 ring-1 ring-gray-300 disabled:opacity-50 dark:bg-gray-800 dark:ring-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 rounded-lg bg-gray-200 px-6 py-2 ring-1 ring-gray-300 disabled:opacity-50 dark:bg-gray-800 dark:ring-gray-700"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {/* Desktop Pagination */}
      <div className="hidden items-center justify-center space-x-2 sm:flex">
        {/* Rows Per Page Drop Down */}
        <div className="items-center">
          <span className="mr-2 text-sm text-gray-700 dark:text-gray-400">
            Rows:
          </span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              onRowsPerPageChange(Number(e.target.value));
            }}
            className="rounded-[7px] border border-gray-300 bg-white p-1 text-sm text-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400"
          >
            {[5, 10, 20, 50, 100].map((size) => (
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
              className="mx-1 flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-gray-900 hover:bg-gray-100 disabled:opacity-50 dark:text-white dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {renderPageNumbers()}
            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="mx-1 flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-gray-900 hover:bg-gray-100 disabled:opacity-50 dark:text-white dark:hover:bg-gray-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
