import SkeletonBox from "./SkeletonBox";

export default function TableSkeleton() {
  // Generate 10 dummy rows for the table body
  const rows = Array.from({ length: 10 });

  // Generate 8 dummy columns for the header
  const columns = Array.from({ length: 8 });

  return (
    <div className="animate-pulse">
      {/* 3. The Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full">
          {/* Table Header */}
          <thead className="bg-gray-700">
            <tr>
              {columns.map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <SkeletonBox className="h-3 w-24 bg-gray-600/50" />
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="even:bg-gray-50 dark:even:bg-gray-900/50"
              >
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="p-6">
                    {/* Vary width slightly for organic look */}
                    <SkeletonBox
                      className={`h-4 rounded ${
                        colIndex === 0
                          ? "w-24"
                          : colIndex === 2
                            ? "w-32"
                            : "w-20"
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination Skeleton */}
      <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
        {/* Rows per page text */}
        <SkeletonBox className="h-5 w-20" />

        {/* Page navigation buttons */}
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-8 w-8 rounded-full" />
          <SkeletonBox className="h-8 w-26 rounded-md" />
          <SkeletonBox className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
