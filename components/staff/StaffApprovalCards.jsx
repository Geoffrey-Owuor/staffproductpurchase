"use client";
import { Clock, XCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function StaffApprovalCards() {
  const [counts, setCounts] = useState({
    pending: 0,
    declined: 0,
    approved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovalCounts = async () => {
      try {
        const response = await fetch("/api/approval-counts");
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

  if (loading) {
    return (
      <div className="mx-4 mb-8 grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-39 animate-pulse rounded-3xl bg-gray-100"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-4 mb-8 grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
      {/* Pending Card */}
      <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
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
          Awaiting approval from invoicing
        </p>
      </div>

      {/* Declined Card */}
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
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
          Requests declined by invoicing
        </p>
      </div>

      {/* Approved Card */}
      <div className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm">
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
          Requests approved by invoicing
        </p>
      </div>
    </div>
  );
}
