// components/Skeletons/PurchaseDetailSkeleton.jsx
export default function PurchaseDetailSkeleton() {
  return (
    <div className="mx-auto animate-pulse p-2">
      {/* Header Skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-5 w-24 rounded bg-gray-200"></div>
        <div className="h-8 w-20 rounded-full bg-gray-200"></div>
        <div className="h-5 w-32 rounded bg-gray-200"></div>
      </div>

      {/* Card Skeleton */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-md">
        {/* Staff Information Section */}
        <div className="border-b border-gray-200 p-6">
          <div className="mb-4 h-6 w-48 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-6 w-full rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="border-b border-gray-200 p-6">
          <div className="mb-4 h-6 w-48 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-6 w-full rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border-b border-gray-200 p-6">
          <div className="mb-4 h-6 w-48 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-6 w-full rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval & Metadata Section */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div>
            <div className="mb-4 h-6 w-48 rounded bg-gray-200"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-6 w-32 rounded-full bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-4 h-6 w-48 rounded bg-gray-200"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i}>
                  <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-6 w-full rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons Skeleton */}
      <div className="mt-6 flex justify-center gap-4">
        <div className="h-10 w-24 rounded-full bg-gray-200"></div>
        <div className="h-10 w-24 rounded-full bg-gray-200"></div>
      </div>
    </div>
  );
}
