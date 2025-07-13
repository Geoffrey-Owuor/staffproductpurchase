"use client";
import { Eye, ChevronRight, ChevronLeft, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TableSkeleton from "../skeletons/TableSkeleton";
import { LoadingBar } from "../Reusables/LoadingBar";

export default function StaffPurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const router = useRouter();

  const rowsPerPage = 7;

  const handleViewClick = (id) => {
    setNavigatingTo(id);
    router.push(`/staffdashboard/purchase-history/purchases/${id}`);
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch("/api/staffpurchaseshistory");
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch purchases");
        }

        if (!Array.isArray(data)) {
          console.warn("Data is not an array:", data); // ✅ Warn if unexpected type
          setPurchases([]);
          setTotalPages(1);
        } else {
          setPurchases(data);
          setTotalPages(Math.ceil(data.length / rowsPerPage));
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Error fetching purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

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
            className={`mx-1 flex h-8 w-8 items-center justify-center rounded-full ${
              currentPage === i
                ? "bg-red-900 text-white"
                : "bg-white text-red-900 hover:bg-red-100"
            }`}
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
            className={`mx-1 flex h-8 w-8 items-center justify-center rounded-full ${
              currentPage === i
                ? "bg-red-900 text-white"
                : "bg-white text-red-900 hover:bg-red-100"
            }`}
          >
            {i}
          </button>,
        );
      }

      pages.push(
        <div key="dropdown" className="relative mx-1">
          <button
            onClick={() => setShowPageDropdown(!showPageDropdown)}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              showPageDropdown
                ? "bg-red-900 text-white"
                : "bg-white text-red-900 hover:bg-red-100"
            }`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {showPageDropdown && (
            <div className="absolute top-full left-0 z-10 mt-1 w-16 rounded-lg bg-white shadow-lg">
              {Array.from({ length: totalPages - 4 }, (_, i) => i + 4).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`block w-full px-3 py-1 text-center text-sm ${
                      currentPage === page
                        ? "bg-red-100 text-red-900"
                        : "hover:bg-red-50"
                    }`}
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
          className={`mx-1 flex h-8 w-8 items-center justify-center rounded-full ${
            currentPage === totalPages
              ? "bg-red-900 text-white"
              : "bg-white text-red-900 hover:bg-red-100"
          }`}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className="p-2">
      {navigatingTo && <LoadingBar isLoading={true} />}
      <h2 className="mb-6 text-center text-2xl font-bold text-red-900">
        All Your Purchase History
      </h2>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-red-50 text-black">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Code
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
            <tbody className="divide-y divide-red-100 bg-white">
              {currentPurchases.length > 0 ? (
                currentPurchases.map((purchase) => (
                  <tr key={purchase.id} className="odd:bg-white even:bg-red-50">
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {purchase.itemname}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {purchase.itemstatus}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {purchase.productcode}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                          purchase.hr_approval === "approved"
                            ? "bg-green-100 text-green-800"
                            : purchase.hr_approval === "declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {purchase.hr_approval}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                          purchase.cc_approval === "approved"
                            ? "bg-green-100 text-green-800"
                            : purchase.cc_approval === "declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {purchase.cc_approval}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                          purchase.bi_approval === "approved"
                            ? "bg-green-100 text-green-800"
                            : purchase.bi_approval === "declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {purchase.bi_approval}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      <div className="ml-3.5 flex">
                        <button
                          onClick={() => handleViewClick(purchase.id)}
                          className="cursor-pointer rounded-full bg-red-900 p-1.5 text-white hover:bg-red-700"
                          title="View"
                          disabled={navigatingTo === purchase.id}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Purchase history not available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {purchases.length > rowsPerPage && (
            <div className="mt-4 flex items-center justify-center">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="mx-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-900 hover:bg-red-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {renderPageNumbers()}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="mx-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-900 hover:bg-red-100 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
