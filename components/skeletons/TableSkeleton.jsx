// components/Skeletons/TableSkeleton.jsx
export default function TableSkeleton() {
  return (
    <div className="flex justify-center p-8">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-900 border-t-transparent dark:border-white dark:border-t-transparent"></div>
    </div>
  );
}
