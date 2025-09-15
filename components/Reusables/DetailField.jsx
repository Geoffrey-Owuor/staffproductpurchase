// Reusable Detail Field Component
export default function DetailField({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
        {value || "N/A"}
      </p>
    </div>
  );
}
