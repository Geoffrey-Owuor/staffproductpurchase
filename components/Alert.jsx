"use client";

import { XIcon, AlertCircle, CheckCircle } from "lucide-react";
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
  const IconComponent = type === "success" ? CheckCircle : AlertCircle;

  // Determine icon color
  const iconColorClass =
    type === "success"
      ? "text-green-500 dark:text-green-700"
      : "text-red-500 dark:text-red-700";

  return (
    <div
      className={`custom:top-0 fixed top-15 right-4 left-4 z-9999 md:left-auto ${
        isClosing ? "animate-slideUp" : "animate-slideDown"
      }`}
    >
      <div
        className={`mt-4 flex w-auto items-center justify-between rounded-xl bg-black px-3 py-4.5 text-white shadow-md dark:bg-white dark:text-black`}
      >
        <div className="flex items-center gap-2">
          {/* Render the appropriate icon */}
          <IconComponent className={`h-5 w-5 shrink-0 ${iconColorClass}`} />
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 cursor-pointer text-gray-200 hover:text-gray-300 dark:text-gray-600 dark:hover:text-gray-700"
          aria-label="Close alert"
        >
          <XIcon className="h-5 w-5 shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default Alert;
