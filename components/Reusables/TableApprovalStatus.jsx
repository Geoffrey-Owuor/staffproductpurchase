import { CircleCheck, Loader } from "lucide-react";

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
    unknown: "bg-gray-500",
  };

  // Select the appropriate color class based on the status prop.
  // It defaults to the 'unknown' color for any unrecognized status.
  const dotClass = statusStyles[status] || statusStyles.unknown;

  // Capitalize the first letter of the status for display
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="inline-flex items-center gap-x-1 rounded-full border border-gray-200 px-2 py-1 dark:border-gray-700">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      <span className="text-xs text-gray-700 dark:text-gray-300">
        {formattedStatus}
      </span>
    </div>
  );
};

export const PaymentStatus = ({ status }) => {
  // Return null if no status is provided
  if (!status) {
    return null;
  }

  // Capitalize the first letter for display
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  // Use a switch statement to handle different UI for each status
  switch (status) {
    case "complete":
      return (
        <div className="inline-flex items-center gap-x-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
          <CircleCheck className="h-4 w-4" />
          {formattedStatus}
        </div>
      );
    case "incomplete":
      return (
        <div className="inline-flex items-center gap-x-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
          <Loader className="h-4 w-4" />
          {formattedStatus}
        </div>
      );
    default: // Handles "unknown" or any other status
      return (
        <div className="inline-flex items-center gap-x-1 rounded-full border border-gray-200 px-2 py-1 dark:border-gray-700">
          <span className="h-2 w-2 rounded-full bg-gray-500" />
          <span className="text-xs text-gray-700 dark:text-gray-300">
            {formattedStatus}
          </span>
        </div>
      );
  }
};
