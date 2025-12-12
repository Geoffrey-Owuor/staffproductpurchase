export default function ApprovalCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative h-39 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800"
        >
          <div className="shimmer absolute inset-0" />
        </div>
      ))}
    </div>
  );
}
