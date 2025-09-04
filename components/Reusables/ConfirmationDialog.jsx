"use client";

import { XCircleIcon } from "lucide-react";

const ConfirmationDialog = ({ message, onConfirm, onCancel, title }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-auto max-w-md rounded-3xl border-2 border-gray-300 bg-white p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <h3 className="mb-3 text-xl font-bold text-gray-700">{title}</h3>
          <button
            onClick={onCancel}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            aria-label="Close dialog"
          >
            <XCircleIcon className="h-7 w-7" />
          </button>
        </div>
        <p className="mb-4 text-center text-gray-700">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-3xl border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-3xl bg-red-900 px-4 py-2 text-white hover:bg-red-700"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
