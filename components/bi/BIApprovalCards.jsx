"use client";
import { Clock, XCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import CardHeadings from "../Reusables/Headings/CardHeadings";
import ApprovalCardsSkeleton from "../skeletons/ApprovalCardsSkeleton";

export default function BIApprovalCards() {
  const [counts, setCounts] = useState({
    pending: 0,
    declined: 0,
    approved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovalCounts = async () => {
      try {
        const response = await fetch("/api/bi/approval-counts");
        if (!response.ok) throw new Error("Failed to fetch counts");

        const data = await response.json();
        setCounts({
          pending: data.pending || 0,
          declined: data.declined || 0,
          approved: data.approved || 0,
        });
      } catch (error) {
        console.error("Error fetching approval counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalCounts();
  }, []);

  return (
    <div className="mx-2 mt-4 mb-8 rounded-xl border border-gray-200 px-2 pt-2 pb-6 shadow-sm">
      {/* Heading */}
      <CardHeadings />

      {loading ? (
        <ApprovalCardsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Pending Card */}
          <div className="rounded-2xl bg-yellow-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Pending</h3>
                <p className="mt-2 text-3xl font-bold text-yellow-900">
                  {counts.pending}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="mt-4 text-sm text-yellow-700">
              Awaiting your approval
            </p>
          </div>

          {/* Declined Card */}
          <div className="rounded-2xl bg-red-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-red-800">Declined</h3>
                <p className="mt-2 text-3xl font-bold text-red-900">
                  {counts.declined}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="mt-4 text-sm text-red-700">
              Requests you've declined
            </p>
          </div>

          {/* Approved Card */}
          <div className="rounded-2xl bg-green-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-green-800">Approved</h3>
                <p className="mt-2 text-3xl font-bold text-green-900">
                  {counts.approved}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="mt-4 text-sm text-green-700">
              Requests you've approved
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
