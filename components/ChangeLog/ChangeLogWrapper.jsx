"use client";
import { FolderClock, Calendar, RefreshCcw } from "lucide-react";
import { revalidateChangelogs } from "@/app/lib/fetchChangelogs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingBar } from "../Reusables/LoadingBar";

// Date formatting helper function to format dates for the ui
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const categoryColors = {
  Feature:
    "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  Improvement:
    "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  Performance:
    "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
};

const ChangeLogWrapper = ({ changelogs }) => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshLogs = async () => {
    setRefreshing(true);
    await revalidateChangelogs();
    router.refresh();
    setRefreshing(false);
  };
  return (
    <>
      <LoadingBar isLoading={refreshing} />
      <div className="containerizing mt-16 mb-12 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <FolderClock className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Changelog History
              </h2>
              <p className="text-base text-gray-500 dark:text-gray-400">
                A record of updates, improvements, and fixes
              </p>
            </div>
          </div>
          <button
            className="hidden cursor-pointer items-center gap-2 rounded-xl bg-gray-950 px-3 py-2 text-white transition-colors hover:bg-gray-800 sm:flex dark:bg-white dark:text-black dark:hover:bg-gray-200"
            onClick={handleRefreshLogs}
          >
            <RefreshCcw className="h-5 w-5" />
            Refresh
          </button>
        </div>
        {/* Changelogs area */}
        <div className="bg-conditions flex-1 rounded-xl p-6">
          <div className="relative space-y-8">
            {/* Vertical timeline line (Optional - remove if too stylized) */}
            <div className="absolute top-2 bottom-2 left-6 w-px bg-gray-100 dark:bg-gray-800" />

            {changelogs.map((log) => (
              <div key={log.id} className="group relative pl-10">
                {/* Timeline Dot */}
                <div className="absolute top-0.5 left-2 h-3 w-3 -translate-x-1/2 rounded-full bg-gray-300 transition-colors group-hover:bg-blue-500 dark:bg-gray-600" />

                {/* Content */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase ${categoryColors[log.category] || "bg-gray-100 text-gray-600"}`}
                      >
                        {log.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-1 text-base font-medium text-gray-900 dark:text-gray-100">
                    {log.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {log.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Footer Note */}
        <div className="mx-auto mt-12 flex max-w-5xl items-center justify-center rounded-xl bg-blue-50 p-6 text-center dark:bg-blue-900/20">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
            This changelog is provided for informational purposes only and may
            not include every change. Features and fixes may vary by environment
            or configuration.
          </p>
        </div>
      </div>
    </>
  );
};

export default ChangeLogWrapper;
