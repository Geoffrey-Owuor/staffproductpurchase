"use client";
import {
  Eye,
  Settings2,
  Trash2,
  MoreVertical,
  GitPullRequestClosed,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";
import ConfirmationDialog from "../ConfirmationDialog";
import { DeletingOverlay } from "../LoadingBar";
import { LoadingBarWave } from "../LoadingBar";
import { useUser } from "@/context/UserContext";

// Reusable style for the dropdown menu items
const menuItemStyles =
  "flex items-center rounded-lg w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-transparent";

export const RecentActionButtons = ({
  id,
  gotoPurchaseEdit,
  gotoPurchaseView,
  biApproval,
  hrApproval,
  payrollApproval,
  ccApproval,
  onDeleteSuccess,
  onDeleteError,
  goingTo,
  closeButton = false,
  closureValue,
  onCloseSuccess,
  onCloseError,
  disableDelete = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { role: userRole } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setIsDeleting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const menuRef = useRef(null);

  // State to store the calculated menu coordinates
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [openUpwards, setOpenUpwards] = useState(false); //state that tracks whether the menu opens upwards or downwards

  const handleConfirmDelete = () => {
    setShowConfirmation(true);
    setIsOpen(false);
  };

  const handleConfirmClose = () => {
    setShowCloseConfirmation(true);
    setIsOpen(false);
  };

  const handleClose = async () => {
    setShowCloseConfirmation(false);
    setIsClosing(true);
    try {
      const response = await fetch(`/api/closepurchase/${id}`, {
        method: "PUT",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error closing Purchase Request");
      }
      onCloseSuccess(result.message);
    } catch (error) {
      console.error("Error Closing Purchase Request:", error);
      onCloseError(error.message);
    } finally {
      setIsClosing(false);
    }
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
      let shouldOpenUpwards = false; //Track direction boolean variable

      // Decide if the menu should open upwards
      if (window.innerHeight - rect.bottom < dropdownHeight) {
        topPosition = rect.top - dropdownHeight + 19;
        shouldOpenUpwards = true; //true when opening upwards
      } else {
        topPosition = rect.bottom + 4;
        shouldOpenUpwards = false; //false when opening downwards
      }

      setOpenUpwards(shouldOpenUpwards); //Update tracking state

      setMenuPosition({
        top: topPosition + window.scrollY,
        left: rect.left + rect.width - dropdownWidth + window.scrollX,
      });
    }
    setIsOpen(!isOpen);
  };

  // The JSX for the menu, to be rendered in the portal
  const DropdownMenu = () => (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: openUpwards ? 10 : -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: openUpwards ? 10 : -10 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      id={`action-menu-${id}`}
      style={{
        position: "absolute",
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
      className="z-50 w-32 rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-800"
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
            //Approver cannot edit once approved
            goingTo === id ||
            (userRole === "payroll" &&
              (payrollApproval === "approved" ||
                payrollApproval === "declined")) ||
            (userRole === "hr" &&
              (hrApproval === "approved" ||
                hrApproval === "declined" ||
                payrollApproval === "declined")) ||
            (userRole === "cc" &&
              (ccApproval === "approved" ||
                ccApproval === "declined" ||
                payrollApproval === "declined" ||
                hrApproval === "declined")) ||
            (userRole === "bi" &&
              (biApproval === "approved" ||
                biApproval === "declined" ||
                payrollApproval === "declined" ||
                hrApproval === "declined" ||
                ccApproval === "declined"))
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
            disabled={
              //Approver cannot delete once approved
              goingTo === id || disableDelete || userRole !== "admin"
            }
            className="mt-1 flex w-full items-center rounded-lg p-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:hover:bg-transparent dark:text-red-400 dark:hover:bg-red-600/15"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>

        {closeButton && (
          <button
            type="button"
            onClick={handleConfirmClose}
            disabled={goingTo === id || closureValue === "closed"}
            className={menuItemStyles}
          >
            <GitPullRequestClosed className="mr-1 h-4 w-4" />
            <span>Close</span>
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {showConfirmation && (
          <DeleteConfirmation
            onConfirm={handleDelete}
            onCancel={() => setShowConfirmation(false)}
          />
        )}

        {showCloseConfirmation && (
          <ConfirmationDialog
            message="Are you sure you want to close this purchase request? (You cannot reopen after closing)"
            onConfirm={handleClose}
            onCancel={() => setShowCloseConfirmation(false)}
            title="Close Purchase Request"
          />
        )}
      </AnimatePresence>

      {deleting && <DeletingOverlay />}
      <LoadingBarWave isLoading={isClosing} />

      <div className="relative inline-block text-left" ref={menuRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          title="More options"
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {mounted &&
          isOpen &&
          createPortal(
            <AnimatePresence>
              <DropdownMenu />
            </AnimatePresence>,
            document.body,
          )}
      </div>
    </>
  );
};
