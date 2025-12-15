"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChangeLogModal from "./ChangeLogModal";
import { X } from "lucide-react";

const ChangeLogAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changelogs, setChangeLogs] = useState([]);

  // UseEffect that fetches new changelogs on mount
  useEffect(() => {
    const fetchChangelogs = async () => {
      try {
        const response = await fetch("/api/changelog");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setChangeLogs(data);
            setIsOpen(true);
            // Timeout for setting showAlert to true after 2 seconds
            setTimeout(() => {
              setShowAlert(true);
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Failed to fetch changelog data:", error);
      }
    };
    fetchChangelogs();
  }, []);

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && showAlert && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 z-400 w-full max-w-md -translate-x-1/2 px-4"
          >
            <div className="flex items-center justify-between rounded-xl bg-gray-950/90 p-4 text-white shadow-lg dark:bg-white/90 dark:text-black">
              <div className="flex-1">
                <p className="text-sm">
                  New updates available! Check out what's new.
                </p>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <button
                  onClick={handleModalOpen}
                  className="rounded-lg bg-white px-3 py-1.5 text-sm text-gray-900 transition-opacity hover:opacity-90 dark:bg-gray-900 dark:text-white"
                >
                  View Changes
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 transition-opacity hover:opacity-70"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <ChangeLogModal
            isModalOpen={isModalOpen}
            changelogs={changelogs}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ChangeLogAlert;
