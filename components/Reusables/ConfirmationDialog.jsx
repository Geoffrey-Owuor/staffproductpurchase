"use client";

import { XCircleIcon } from "lucide-react";

const ConfirmationDialog = ({ message, onConfirm, onCancel, title }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/50">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-950">
        <div className="flex items-start justify-between">
          <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onCancel}
            className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close dialog"
          >
            <XCircleIcon className="h-7 w-7" />
          </button>
        </div>
        <p className="mb-4 text-center text-gray-700 dark:text-gray-400">
          {message}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="rounded-3xl border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-3xl bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
