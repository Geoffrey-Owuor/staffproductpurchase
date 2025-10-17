"use client";
import { Eye, Settings2, Trash2, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ConfirmationDialog from "../ConfirmationDialog";
import { DeletingOverlay } from "../LoadingBar";
import { useUser } from "@/context/UserContext";

// Reusable style for the dropdown menu items
const menuItemStyles =
  "flex items-center rounded-md w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-transparent";

export const RecentActionButtons = ({
  id,
  gotoPurchaseEdit,
  gotoPurchaseView,
  biApproval,
  hrApproval,
  ccApproval,
  onDeleteSuccess,
  onDeleteError,
  goingTo,
  disableDelete = false,
}) => {
  const { role: userRole } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const menuRef = useRef(null);

  // State to store the calculated menu coordinates
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

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

      onDeleteSuccess(id, result.message);
    } catch (error) {
      console.error("Error Deleting Purchase Request: ", error);
      onDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Effect to handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuElement = document.getElementById(`action-menu-${id}`);
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        (!menuElement || !menuElement.contains(event.target))
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [id, isOpen]);

  const handleActionClick = (action) => {
    action(id);
    setIsOpen(false);
  };

  // Update toggleDropdown to calculate precise coordinates for the portal
  const toggleDropdown = () => {
    if (!isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const dropdownHeight = 150; // Estimated height of the dropdown
      const dropdownWidth = 128; // w-32 = 8rem = 128px
      let topPosition;

      // Decide if the menu should open upwards
      if (window.innerHeight - rect.bottom < dropdownHeight) {
        topPosition = rect.top - dropdownHeight + 19;
      } else {
        topPosition = rect.bottom + 4;
      }

      setMenuPosition({
        top: topPosition + window.scrollY,
        left: rect.left + rect.width - dropdownWidth + window.scrollX,
      });
    }
    setIsOpen(!isOpen);
  };

  // The JSX for the menu, to be rendered in the portal
  const DropdownMenu = () => (
    <div
      id={`action-menu-${id}`}
      style={{
        position: "absolute",
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
      className="z-50 w-32 rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="p-1">
        <button
          type="button"
          onClick={() => handleActionClick(gotoPurchaseView)}
          disabled={goingTo === id}
          className={menuItemStyles}
        >
          <Eye className="mr-1 h-4 w-4" />
          <span>View</span>
        </button>

        <button
          type="button"
          onClick={() => handleActionClick(gotoPurchaseEdit)}
          disabled={
            goingTo === id ||
            (userRole === "hr" && hrApproval === "approved") ||
            (userRole === "cc" && ccApproval === "approved") ||
            (userRole === "bi" && biApproval === "approved")
          }
          className={menuItemStyles}
        >
          <Settings2 className="mr-1 h-4 w-4" />
          <span>Edit</span>
        </button>

        <div className="mt-1 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={goingTo === id || disableDelete}
            className="mt-1 flex w-full items-center rounded-md p-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:hover:bg-transparent dark:text-red-400 dark:hover:bg-[#4c2e2f]"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this purchase request? (This action is irreversible)"
          title="Delete Purchase Request"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {deleting && <DeletingOverlay />}

      <div className="relative inline-block text-left" ref={menuRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          title="More options"
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {isOpen && createPortal(<DropdownMenu />, document.body)}
      </div>
    </>
  );
};
