import SkeletonBox from "./SkeletonBox";

export default function PurchaseDetailSkeleton() {
  return (
    <div className="mx-auto p-2 dark:bg-gray-950">
      {/* Header Skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <SkeletonBox className="h-6 w-40" />
        <div className="hidden items-center justify-end gap-4 md:flex">
          <SkeletonBox className="h-9 w-20" />
          <SkeletonBox className="h-7 w-7" />
          <SkeletonBox className="h-9 w-33" />
          <SkeletonBox className="h-9 w-33" />
          <SkeletonBox className="h-9 w-33" />
        </div>
      </div>

      {/* Card Skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
        {/* Staff Information Section */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <SkeletonBox className="mb-2 h-4 w-24" />
                <SkeletonBox className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <SkeletonBox className="mb-2 h-4 w-24" />
                <SkeletonBox className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <SkeletonBox className="mb-2 h-4 w-24" />
                <SkeletonBox className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Pricing Section 1 */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <SkeletonBox className="mb-2 h-4 w-24" />
                <SkeletonBox className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Pricing Section 2 */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <SkeletonBox className="mb-2 h-4 w-24" />
                <SkeletonBox className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Approval & Metadata Section */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div>
            <SkeletonBox className="mb-4 h-6 w-48" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <SkeletonBox className="h-4 w-24" />
                  <SkeletonBox className="h-6 w-32" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SkeletonBox className="mb-4 h-6 w-48" />
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i}>
                  <SkeletonBox className="mb-2 h-4 w-24" />
                  <SkeletonBox className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons Skeleton */}
      <div className="mt-6 flex justify-center gap-4">
        <SkeletonBox className="h-10 w-24" />
        <SkeletonBox className="h-10 w-24" />
      </div>
    </div>
  );
}
