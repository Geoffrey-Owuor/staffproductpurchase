export const TableApprovalStatus = ({ status }) => {
  // Return nothing if the status is not provided to avoid rendering empty space
  if (!status) {
    return null;
  }

  // Define the color mappings for the status dot
  const statusStyles = {
    approved: "bg-green-500",
    declined: "bg-red-500",
    pending: "bg-yellow-500",
  };

  // Select the appropriate color class based on the status prop.
  // It defaults to the 'pending' color for any unrecognized status.
  // The .toLowerCase() makes it robust against variations like "Approved" or "APPROVED".
  const dotClass = statusStyles[status.toLowerCase()] || statusStyles.pending;

  // Capitalize the first letter of the status for display
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="inline-flex items-center gap-x-2 rounded-md border border-gray-200 p-1 dark:border-gray-700">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      <span className="text-xs text-gray-700 dark:text-gray-300">
        {formattedStatus}
      </span>
    </div>
  );
};
