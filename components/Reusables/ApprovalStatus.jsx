// Reusable Approval Status Component
export default function ApprovalStatus({ label, status }) {
  // Return null if no status is provided to avoid rendering an empty element
  if (!status) {
    return null;
  }

  // A new mapping specifically for the dot's color
  const statusDotColors = {
    approved: "bg-green-500",
    declined: "bg-red-500",
    pending: "bg-yellow-500",
  };

  // Select the dot's color, defaulting to gray for any unknown status
  const dotClass = statusDotColors[status.toLowerCase()] || "bg-gray-500";

  // Capitalize the first letter for display
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {/* This is the new UI for the status indicator */}
      <div className="mt-1 inline-flex items-center gap-x-2 rounded-md border border-gray-300 p-1 dark:border-gray-600">
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
        <span className="text-sm text-gray-800 dark:text-gray-200">
          {formattedStatus}
        </span>
      </div>
    </div>
  );
}
