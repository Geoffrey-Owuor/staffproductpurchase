import React from "react";
import { Sparkles } from "lucide-react";

const ChangelogSkeleton = () => {
  return (
    <div className="mx-auto mt-16 mb-12 max-w-7xl px-4 py-3">
      {/* Header */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Sparkles className="h-6 w-6" />
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

      {/* Changelogs area with skeleton */}
      <div className="bg-conditions mx-auto max-w-5xl flex-1 rounded-xl p-6">
        <div className="relative space-y-8">
          {/* Vertical timeline line */}
          <div className="absolute top-2 bottom-2 left-6 w-px bg-gray-100 dark:bg-gray-800" />

          {/* Skeleton items */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="relative pl-10">
              {/* Timeline Dot */}
              <div className="absolute top-0.5 left-2 h-3 w-3 -translate-x-1/2 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />

              {/* Content */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {/* Category badge skeleton */}
                  <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />

                  {/* Date skeleton */}
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Title skeleton */}
                <div className="mt-1 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

                {/* Description skeleton - multiple lines */}
                <div className="mt-1 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note skeleton */}
      <div className="mx-auto mt-12 flex max-w-5xl items-center justify-center rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
        <div className="h-4 w-3/4 animate-pulse rounded bg-blue-200 dark:bg-blue-800" />
      </div>
    </div>
  );
};

export default ChangelogSkeleton;
