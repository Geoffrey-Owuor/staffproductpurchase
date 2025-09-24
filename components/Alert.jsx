"use client";

import { XIcon, BadgeAlert, BadgeCheck } from "lucide-react";
import { useState, useEffect } from "react";

const Alert = ({ message, type, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200); // Match this with animation duration
  };

  //Auto close after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Determine which icon to display based on type
  const IconComponent = type === "success" ? BadgeCheck : BadgeAlert;

  // Determine icon color
  const iconColorClass =
    type === "success"
      ? "text-green-500 dark:text-green-700"
      : "text-red-500 dark:text-red-700";

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-9999 flex justify-center ${
        isClosing ? "animate-slideUp" : "animate-slideDown"
      }`}
    >
      <div
        className={`mt-4 flex max-w-md min-w-[300px] items-center justify-between rounded-xl border border-gray-200 bg-black/70 p-3 text-white shadow-md dark:border-gray-800 dark:bg-white/70 dark:text-black`}
      >
        <div className="flex items-center gap-2">
          {/* Render the appropriate icon */}
          <IconComponent className={`h-5 w-5 ${iconColorClass}`} />
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 cursor-pointer text-gray-200 hover:text-gray-300 dark:text-gray-600 dark:hover:text-gray-700"
          aria-label="Close alert"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Alert;
