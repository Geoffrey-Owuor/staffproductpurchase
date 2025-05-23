"use client";

import { XCircleIcon } from "lucide-react";

const Alert = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";
  const borderColor =
    type === "success" ? "border-green-300" : "border-red-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`${bgColor} ${textColor} ${borderColor} mx-auto max-w-md rounded-3xl border-2 p-4 shadow-lg`}
      >
        <div className="flex items-start justify-between">
          <h3 className="mb-3 text-xl font-bold">
            {type === "success" ? "Success!" : "Error!"}
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            aria-label="Close alert"
          >
            <XCircleIcon className="h-7 w-7" />
          </button>
        </div>
        <p className="mb-4 text-center">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className={`cursor-pointer rounded-3xl px-6 py-2 ${
              type === "success"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
