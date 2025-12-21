"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { motion } from "framer-motion";

const ConfirmationDialog = ({ message, onConfirm, onCancel, title }) => {
  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 duration-200 dark:bg-black/60`}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="mx-auto max-w-90 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-2xl md:max-w-md dark:border-gray-700 dark:bg-gray-950"
      >
        <div className="flex items-start justify-between">
          <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onCancel}
            type="button"
            className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close dialog"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="mb-4 text-center text-gray-700 dark:text-gray-400">
          {message}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            type="button"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            Proceed
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
  return createPortal(content, document.body);
};

export default ConfirmationDialog;
