"use client";
import { Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TableSkeleton from "../skeletons/TableSkeleton";

export default function HrPurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const router = useRouter();

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const handleViewClick = (id) => {
    setNavigatingTo(id);
    router.push(`/hrdashboard/requests-history/requests/${id}`);
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const url = `/api/hr/hrpurchaseshistory${debouncedSearchTerm ? `?search=${encodeURIComponent(debouncedSearchTerm)}` : ""}`;
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

  return (
    <div className="p-2">
      <h2 className="mb-6 text-center text-2xl font-bold text-red-900">
        Staff Purchase Requests History
      </h2>

      {/* Search Bar */}
      <div className="mx-auto mb-4 max-w-md">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 placeholder-gray-500 focus:border-red-500 focus:ring-0 focus:ring-red-500 focus:outline-none sm:text-sm"
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
                className="h-5 w-5 text-gray-400"
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
        <div className="overflow-x-auto rounded-2xl border border-red-200 shadow">
          <table className="min-w-full divide-y divide-red-200">
            <thead className="bg-red-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                  Payroll
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                  HR Approval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                  CC Approval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                  BI Approval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-200 bg-white">
              {purchases.length > 0 ? (
                purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {purchase.itemname}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {purchase.staffname}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {purchase.payrollno}
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
                          {navigatingTo === purchase.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
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
                    {debouncedSearchTerm
                      ? "No purchases found matching your search."
                      : "No purchase history available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
