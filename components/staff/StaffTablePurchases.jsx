"use client";
import { Eye, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TableSkeleton from "../skeletons/TableSkeleton";

export default function StaffTablePurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState(null);
  const [goingTo, setGoingTo] = useState(null);
  const router = useRouter();

  const handleViewClick = (id) => {
    setNavigatingTo(id);
    router.push(`/staffdashboard/purchase-history/purchases/${id}`);
  };

  const handleEditClick = (id) => {
    setGoingTo(id);
    router.push(`/staffdashboard/purchase-history/purchases/${id}/edit`);
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch("/api/stafftablepurchases");
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

  return (
    <div className="p-2">
      <h2 className="mb-6 text-center text-2xl font-bold text-red-900">
        Recent Purchase Requests
      </h2>

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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                  Code
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
                      <div className="flex space-x-2">
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
                        {purchase.bi_approval !== "approved" && (
                          <button
                            onClick={() => handleEditClick(purchase.id)}
                            className="cursor-pointer rounded-full bg-red-100 p-1.5 text-black hover:bg-red-200"
                            title="Edit"
                            disabled={goingTo === purchase.id}
                          >
                            {goingTo === purchase.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border border-black border-t-transparent"></div>
                            ) : (
                              <Pencil className="h-4 w-4" />
                            )}
                          </button>
                        )}
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
                    No recent purchases available
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
