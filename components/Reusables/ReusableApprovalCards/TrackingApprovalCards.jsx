"use client";
import { CheckCircle2, Loader, RotateCcw, UserRoundCheck } from "lucide-react";
import ApprovalCardsSkeleton from "@/components/skeletons/ApprovalCardsSkeleton";
import { StatCard } from "../StatCard";
import { useQuery } from "@tanstack/react-query";
import {
  fetchTrackingCounts,
  defaultClosureCounts,
} from "@/utils/FetchCardCounts/fetchTrackingCounts";

export default function TrackingApprovalCards() {
  const {
    data: counts = defaultClosureCounts,
    isLoading: loading,
    refetch: refetchCounts,
  } = useQuery({
    queryKey: ["TrackingApprovalCardCounts"],
    queryFn: fetchTrackingCounts,
  });

  return (
    <div className="mb-8 rounded-xl px-2">
      {/* Render Heading Dynamically */}
      <div className="flex items-center space-x-5">
        <div className="mt-3 mb-2 px-1 pb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Closed & Open Requests
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Summary of fully approved, open, & closed requests
          </p>
        </div>
        <button
          className="hidden rounded-full bg-gray-100 p-2 transition-colors duration-200 hover:bg-gray-200 md:flex dark:bg-gray-900 dark:hover:bg-gray-800"
          onClick={() => refetchCounts()}
          title="refresh"
        >
          <RotateCcw />
        </button>
      </div>

      {/* Cards Grid */}

      {loading ? (
        <ApprovalCardsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Open Card */}
          <StatCard
            title="Open"
            count={counts.open > 500 ? "500+" : counts.open}
            description="Summary of open requests"
            IconComponent={Loader}
          />
          {/* Closed Card */}
          <StatCard
            title="Closed"
            count={counts.closed > 500 ? "500+" : counts.closed}
            description="Summary of closed requests"
            IconComponent={UserRoundCheck}
          />

          {/* Approved Card */}
          <StatCard
            title="Approved"
            count={counts.approved > 500 ? "500+" : counts.approved}
            description="Summary of approved requests"
            IconComponent={CheckCircle2}
          />
        </div>
      )}
    </div>
  );
}
