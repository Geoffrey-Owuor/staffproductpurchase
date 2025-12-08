"use client";
import { CheckCircle2, Loader, RotateCcw, UserRoundCheck } from "lucide-react";
import ApprovalCardsSkeleton from "@/components/skeletons/ApprovalCardsSkeleton";
import { useEffect } from "react";
import { StatCard } from "../StatCard";
import { useLoadingLine } from "@/context/LoadingLineContext";
import { useTrackingApprovalCards } from "@/context/TrackingApprovalCardsContext";

export default function TrackingApprovalCards() {
  const { stopLoading } = useLoadingLine();

  useEffect(() => {
    stopLoading();
  }, [stopLoading]);

  const { loading, counts, refetchCounts } = useTrackingApprovalCards();

  return (
    <div className="bg-gradient-classes mx-2 mt-4 mb-8 rounded-xl border border-gray-200 px-2 pt-2 pb-3 dark:border-gray-700">
      {/* Render Heading Dynamically */}
      <div className="flex items-center space-x-5">
        <div className="mt-3 mb-2 px-1 pb-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Closed & Open Requests
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Summary of fully approved, open, & closed requests
          </p>
        </div>
        <button
          className="hidden rounded-full bg-slate-200/50 p-2 transition-colors duration-200 hover:bg-slate-200 md:flex dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={refetchCounts}
          title="refresh"
        >
          <RotateCcw />
        </button>
      </div>

      {/* Cards Grid */}

      {loading ? (
        <ApprovalCardsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-3">
          {/* Open Card */}
          <StatCard
            title="Open"
            count={counts.open}
            description="Summary of open requests"
            IconComponent={Loader}
          />
          {/* Closed Card */}
          <StatCard
            title="Closed"
            count={counts.closed}
            description="Summary of closed requests"
            IconComponent={UserRoundCheck}
          />

          {/* Approved Card */}
          <StatCard
            title="Approved"
            count={counts.approved}
            description="Summary of approved requests"
            IconComponent={CheckCircle2}
          />
        </div>
      )}
    </div>
  );
}
