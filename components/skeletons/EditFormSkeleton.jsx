// components/Skeletons/EditFormSkeleton.jsx
export default function EditFormSkeleton() {
  return (
    <div className="mx-auto animate-pulse p-2">
      {/* Header Skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-24 rounded bg-gray-200"></div>
        <div className="h-8 w-48 rounded bg-gray-200"></div>
        <div className="h-6 w-24 rounded bg-gray-200"></div>
      </div>

      {/* Form Sections Skeleton */}
      <div className="space-y-6">
        {/* Staff Info Section Skeleton */}
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 h-6 w-48 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-10 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Details Section Skeleton */}
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 h-6 w-48 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-10 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex justify-center space-x-4">
          <div className="h-10 w-24 rounded-full bg-gray-200"></div>
          <div className="h-10 w-32 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
