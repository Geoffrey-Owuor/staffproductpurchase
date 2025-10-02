import { Eye, Settings2 } from "lucide-react"; // Assuming you're using lucide-react for icons

const iconButtonStyles =
  "p-1.5 rounded-md border border-gray-300 dark:border-gray-600 transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50";

export const RecentActionButtons = ({
  id,
  gotoPurchaseEdit,
  gotoPurchaseView,
  biApproval,
  goingTo,
}) => {
  return (
    <div className="flex items-center space-x-1">
      {/* View Button */}
      <button
        type="button"
        onClick={() => gotoPurchaseView(id)}
        disabled={goingTo === id}
        title="View"
        className={`${iconButtonStyles}`}
      >
        <Eye className="h-4 w-4" />
      </button>

      {/* Conditionally rendered Edit Button */}
      {(biApproval !== "approved" || biApproval === "declined") && (
        <button
          type="button"
          onClick={() => gotoPurchaseEdit(id)}
          disabled={goingTo === id}
          title="Edit"
          className={`${iconButtonStyles}`}
        >
          <Settings2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
