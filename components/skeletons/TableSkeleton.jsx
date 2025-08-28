// components/Skeletons/TableSkeleton.jsx
export default function TableSkeleton() {
  return (
    <div className="flex justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-900 border-t-transparent"></div>
    </div>
  );
}
