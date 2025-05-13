// Reusable Detail Field Component
export default function DetailField({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900">
        {value || "N/A"}
      </p>
    </div>
  );
}
