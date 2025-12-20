import SkeletonBox from "./SkeletonBox";

export default function PurchaseDetailSkeleton() {
  return (
    <div className="mx-auto rounded-xl pb-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-2 pt-2 pb-4">
        <SkeletonBox className="h-6 w-40" />
        <div className="hidden items-center justify-end gap-4 md:flex">
          <SkeletonBox className="h-9 w-20" />
          <SkeletonBox className="h-7 w-7" />
          <SkeletonBox className="h-9 w-33" />
          <SkeletonBox className="h-9 w-33" />
          <SkeletonBox className="h-9 w-33" />
        </div>
      </div>
      {/* Staff Information Section */}
      <div className="border-b border-gray-200 px-2 py-6 dark:border-gray-700">
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
      <div className="border-b border-gray-200 px-2 py-6 dark:border-gray-700">
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
      <div className="border-b border-gray-200 px-2 py-6 dark:border-gray-700">
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
      <div className="border-b border-gray-200 px-2 py-6 dark:border-gray-700">
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
      <div className="border-b border-gray-200 px-2 py-6 dark:border-gray-700">
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
      <div className="grid grid-cols-1 gap-6 px-2 py-6 md:grid-cols-2">
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
      {/* Bottom Buttons Skeleton */}
      <div className="mt-6 flex justify-center gap-4">
        <SkeletonBox className="h-10 w-24" />
        <SkeletonBox className="h-10 w-24" />
      </div>
    </div>
  );
}
