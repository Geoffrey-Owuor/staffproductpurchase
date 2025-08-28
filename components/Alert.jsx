"use client";

import { XIcon } from "lucide-react";
import { useState, useEffect } from "react";

const Alert = ({ message, type, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200); // Match this with animation duration
  };

  //Auto close after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 flex justify-center ${
        isClosing ? "animate-slideUp" : "animate-slideDown"
      }`}
    >
      <div
        className={`${bgColor} ${textColor} mt-4 flex w-[270px] items-center justify-between rounded-full p-3 shadow-md`}
      >
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="ml-4 cursor-pointer text-gray-500 hover:text-gray-700"
          aria-label="Close alert"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Alert;
