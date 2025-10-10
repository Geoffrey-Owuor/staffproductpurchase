"use client";
import { Eye, Settings2, Trash2, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ConfirmationDialog from "../ConfirmationDialog";
import { DeletingOverlay } from "../LoadingBar";

// Reusable style for the dropdown menu items
const menuItemStyles =
  "flex items-center rounded-md w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-transparent";

export const RecentActionButtons = ({
  id,
  gotoPurchaseEdit,
  gotoPurchaseView,
  biApproval,
  onDeleteSuccess,
  onDeleteError,
  goingTo,
  disableDelete = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const menuRef = useRef(null);

  const handleConfirmDelete = () => {
    setShowConfirmation(true);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    setShowConfirmation(false);
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/deletepurchases/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error Deleting Purchase Request");
      }

      onDeleteSuccess(id, result.message); //Notifying the parent component - the handleDeleteSuccess function
    } catch (error) {
      console.error("Error Deleting Purchase Request: ", error);
      //Notify the parent component about the error
      onDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Effect to handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActionClick = (action) => {
    action(id);
    setIsOpen(false); // Close the menu after an action is triggered
  };

  return (
    <>
      {/* Confirmation Dialogue */}
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this purchase request? (This action is irreversible)"
          title="Delete Purchase Request"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {/* Deleting Overlay */}
      {deleting && <DeletingOverlay />}

      <div className="relative inline-block text-left" ref={menuRef}>
        {/* Dropdown Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title="More options"
          className="rounded-md border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 w-30 rounded-md border border-gray-200 bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800">
            <div className="p-1">
              {/* View Button */}
              <button
                type="button"
                onClick={() => handleActionClick(gotoPurchaseView)}
                disabled={goingTo === id}
                className={menuItemStyles}
              >
                <Eye className="mr-1 h-4 w-4" />
                <span>View</span>
              </button>

              {/* Conditionally rendered Edit Button */}
              {(biApproval !== "approved" || biApproval === "declined") && (
                <button
                  type="button"
                  onClick={() => handleActionClick(gotoPurchaseEdit)}
                  disabled={goingTo === id}
                  className={menuItemStyles}
                >
                  <Settings2 className="mr-1 h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}

              {!disableDelete && (
                <div className="mt-1 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={goingTo === id}
                    className="mt-1 flex w-full items-center rounded-md p-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:hover:bg-transparent dark:text-red-400 dark:hover:bg-[#4c2e2f]"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
