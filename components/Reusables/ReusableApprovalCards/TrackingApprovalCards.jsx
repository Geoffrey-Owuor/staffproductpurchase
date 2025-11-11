"use client";
import { CheckCircle2, Loader, UserRoundCheck } from "lucide-react";
import ApprovalCardsSkeleton from "@/components/skeletons/ApprovalCardsSkeleton";
import { StatCard } from "../StatCard";
import { useTrackingApprovalCards } from "@/context/TrackingApprovalCardsContext";

export default function TrackingApprovalCards() {
  const { loading, counts } = useTrackingApprovalCards();

  return (
    <div className="mx-2 mt-4 mb-8 rounded-xl border border-gray-200 px-2 pt-2 pb-3 dark:border-gray-700 dark:bg-gray-950">
      {/* Render Heading Dynamically */}
      <div className="mt-3 mb-2 px-1 pb-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Closed & Open Requests
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Summary of fully approved open & closed requests
        </p>
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
            description="Summary of all open requests"
            IconComponent={Loader}
          />
          {/* Closed Card */}
          <StatCard
            title="Closed"
            count={counts.closed}
            description="Summary of all closed requests"
            IconComponent={UserRoundCheck}
          />

          {/* Approved Card */}
          <StatCard
            title="Approved"
            count={counts.approved}
            description="Summary of all requests fully approved"
            IconComponent={CheckCircle2}
          />
        </div>
      )}
    </div>
  );
}
