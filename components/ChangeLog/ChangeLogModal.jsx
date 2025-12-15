"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, X, Calendar } from "lucide-react";

// Date formatting helper function to format dates for the ui
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const categoryColors = {
  Feature:
    "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  Improvement:
    "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  Performance:
    "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
};

const ChangeLogModal = ({ changelogs, isModalOpen, setIsModalOpen }) => {
  // Effect to prevent html scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.documentElement.style.overflow = "unset";
    };
  }, [isModalOpen]);

  //   Handle closing and updating the database on close
  const handleClose = async () => {
    setIsModalOpen(false); //Close ui immediately for better UX
    try {
      // Tell the backend user has seen the updates
      await fetch("/api/changelog", { method: "PUT" });
    } catch (error) {
      console.error("Failed to mark changelogs as read:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-400 flex items-center justify-center bg-white/50 p-4 dark:bg-black/60"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-black"
      >
        {/* Header - Clean and Professional */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                What's New
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Latest updates and improvements
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="max-h-[calc(100vh-12rem)] flex-1 overflow-y-auto p-6">
          <div className="relative space-y-8">
            {/* Vertical timeline line (Optional - remove if too stylized) */}
            <div className="absolute top-2 bottom-2 left-6 w-px bg-gray-100 dark:bg-gray-800" />

            {changelogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
                className="group relative pl-10"
              >
                {/* Timeline Dot */}
                <div className="absolute top-0.5 left-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-gray-200 transition-colors group-hover:bg-blue-500 dark:border-gray-950 dark:bg-gray-700" />

                {/* Content */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase ${categoryColors[log.category] || "bg-gray-100 text-gray-600"}`}
                      >
                        {log.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-1 text-base font-medium text-gray-900 dark:text-gray-100">
                    {log.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {log.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer - Simple Action */}
        <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
          <button
            onClick={handleClose}
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <Sparkles className="h-4 w-4" />
            Got it, thanks!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChangeLogModal;
