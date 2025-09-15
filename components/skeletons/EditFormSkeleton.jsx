import SkeletonBox from "./SkeletonBox";

export default function EditFormSkeleton() {
  return (
    <div className="mx-auto p-2 dark:bg-gray-950">
      {/* Header Skeleton */}
      <div className="mb-6 flex items-center justify-between px-4">
        <SkeletonBox className="h-6 w-24" />
        <SkeletonBox className="h-8 w-48" />
        <div className="h-6 w-24"></div>
      </div>

      {/* Form Sections Skeleton */}
      <div className="space-y-6">
        {/* Staff Info Section Skeleton */}
        <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700 dark:bg-gray-950">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details Section Skeleton 1 */}
        <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700 dark:bg-gray-950">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Product Details Section Skeleton 2 */}
        <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700 dark:bg-gray-950">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Product Details Section Skeleton 3 */}
        <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700 dark:bg-gray-950">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex justify-center space-x-4">
          <SkeletonBox className="h-10 w-24" />
          <SkeletonBox className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
