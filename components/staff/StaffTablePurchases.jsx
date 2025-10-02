"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TableSkeleton from "../skeletons/TableSkeleton";
import { LoadingBar } from "../Reusables/LoadingBar";
import RecentPurchasesHeading from "../Reusables/Headings/RecentPurchasesHeading";
import { RecentActionButtons } from "../Reusables/RecentActionButtons/RecentActionButtons";
import { TableApprovalStatus } from "../Reusables/TableApprovalStatus";

export default function StaffTablePurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goingTo, setGoingTo] = useState(null);
  const router = useRouter();

  const gotoPurchaseView = (id) => {
    setGoingTo(id);
    router.push(`/staffdashboard/purchase-history/purchases/${id}`);
  };

  const gotoPurchaseEdit = (id) => {
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
    <div className="m-2 rounded-xl border border-gray-200 px-2 pt-2 pb-4 dark:border-gray-700 dark:bg-gray-950">
      {goingTo && <LoadingBar isLoading={true} />}

      {/* Heading */}
      <RecentPurchasesHeading />

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
              {purchases.length > 0 ? (
                purchases.map((purchase) => (
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
                      <RecentActionButtons
                        id={purchase.id}
                        gotoPurchaseEdit={gotoPurchaseEdit}
                        gotoPurchaseView={gotoPurchaseView}
                        biApproval={purchase.bi_approval}
                        goingTo={goingTo}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
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
