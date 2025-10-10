"use client";
import { Eye, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TableSkeleton from "../skeletons/TableSkeleton";
import { LoadingBar } from "../Reusables/LoadingBar";
import PurchasesHistoryHeading from "../Reusables/Headings/PurchasesHistoryHeading";
import { TableApprovalStatus } from "../Reusables/TableApprovalStatus";
import Pagination from "../pagination/Pagination";

export default function StaffPurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();

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
  }, []);

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
      {navigatingTo && <LoadingBar isLoading={true} />}
      <PurchasesHistoryHeading />

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
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                      {purchase.itemstatus}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                      {purchase.productcode}
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
                      <div className="group ml-1.5 flex">
                        <button
                          onClick={() => handleViewClick(purchase.id)}
                          className="rounded-md border border-gray-300 p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                          title="View"
                          disabled={navigatingTo === purchase.id}
                        >
                          <MoreVertical className="h-4 w-4 group-hover:hidden" />
                          <Eye className="hidden h-4 w-4 group-hover:block" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
                  >
                    Purchase history not available
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
