"use client";
import { Clock, XCircle, CheckCircle2, TrendingUp } from "lucide-react";
import ApprovalCardsSkeleton from "@/components/skeletons/ApprovalCardsSkeleton";
import { StatCard } from "../StatCard";
import CardHeadings from "../Headings/CardHeadings";
import { useUser } from "@/context/UserContext";
import SkeletonBox from "@/components/skeletons/SkeletonBox";
import { useApprovalCounts } from "@/context/ApprovalCountsContext";

export default function ApprovalCards() {
  const { role: userRole } = useUser();
  const { counts, loading } = useApprovalCounts();

  return (
    <div className="bg-gradient-classes mx-2 mt-4 mb-8 rounded-xl border border-gray-200 px-2 pt-2 pb-3 dark:border-gray-700">
      {/* Render Heading Dynamically */}
      <div className="flex items-center justify-between">
        {userRole === "staff" ? (
          <div className="mt-3 mb-2 px-1 pb-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Approval status
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Summary of all approval requests sent to billing & invoicing
            </p>
          </div>
        ) : (
          <CardHeadings />
        )}

        {loading ? (
          <>
            {userRole !== "staff" && (
              <SkeletonBox className="mr-2 hidden h-12 w-25 md:flex" />
            )}
          </>
        ) : (
          <>
            {userRole !== "staff" && (
              <div className="mr-2 hidden rounded-xl bg-slate-200 p-3 md:flex dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-semibold">
                    {counts.total}
                  </span>{" "}
                  <TrendingUp />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cards Grid */}

      {loading ? (
        <ApprovalCardsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-3">
          {/* Pending Card */}
          <StatCard
            title="Pending"
            count={counts.pending}
            description={
              userRole === "staff"
                ? "Awaiting invoicing approval"
                : "Awaiting your approval"
            }
            IconComponent={Clock}
          />
          {/* Declined Card */}
          <StatCard
            title="Declined"
            count={counts.declined}
            description={
              userRole === "staff"
                ? "Declined Requests"
                : "Requests you've declined"
            }
            IconComponent={XCircle}
          />

          {/* Approved Card */}
          <StatCard
            title="Approved"
            count={counts.approved}
            description={
              userRole === "staff"
                ? "Approved by invoicing"
                : "Requests you've approved"
            }
            IconComponent={CheckCircle2}
          />
        </div>
      )}
    </div>
  );
}
