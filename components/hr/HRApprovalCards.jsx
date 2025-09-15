"use client";
import { Clock, XCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import CardHeadings from "../Reusables/Headings/CardHeadings";
import ApprovalCardsSkeleton from "../skeletons/ApprovalCardsSkeleton";
import { StatCard } from "../Reusables/StatCard";

export default function HRApprovalCards() {
  const [counts, setCounts] = useState({
    pending: 0,
    declined: 0,
    approved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovalCounts = async () => {
      try {
        const response = await fetch("/api/hr/approval-counts");
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
    <div className="mx-2 mt-4 mb-8 rounded-xl border border-gray-200 px-2 pt-2 pb-6 dark:border-gray-700 dark:bg-gray-950">
      {/* Heading */}
      <CardHeadings />

      {/* Cards Grid */}
      {loading ? (
        <ApprovalCardsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Pending Card */}
          <StatCard
            title="Pending"
            count={counts.pending}
            description="Awaiting your approval"
            IconComponent={Clock}
          />
          {/* Declined Card */}
          <StatCard
            title="Declined"
            count={counts.declined}
            description="Requests you've declined"
            IconComponent={XCircle}
          />

          {/* Approved Card */}
          <StatCard
            title="Approved"
            count={counts.approved}
            description="Requests you've approved"
            IconComponent={CheckCircle2}
          />
        </div>
      )}
    </div>
  );
}
