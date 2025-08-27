import SkeletonBox from "./SkeletonBox";

export default function PurchaseDetailSkeleton() {
  return (
    <div className="mx-auto p-2">
      {/* Header Skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <SkeletonBox className="h-5 w-24" />
        <SkeletonBox className="h-8 w-20 rounded-full" />
        <SkeletonBox className="h-5 w-32" />
      </div>

      {/* Card Skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {/* Staff Information Section */}
        <div className="border-b border-gray-200 p-6">
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
        <div className="border-b border-gray-200 p-6">
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
        <div className="border-b border-gray-200 p-6">
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
                  <SkeletonBox className="h-6 w-32 rounded-full" />
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
        <SkeletonBox className="h-10 w-24 rounded-full" />
        <SkeletonBox className="h-10 w-24 rounded-full" />
      </div>
    </div>
  );
}
