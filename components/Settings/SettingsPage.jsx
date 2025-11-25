import { useState } from "react";
import { CircleUserRound, ShieldUser, X } from "lucide-react";
import { motion } from "framer-motion"; // 1. Import motion
import GeneralSettingsPage from "./GeneralSettingsPage";
import SecuritySettingsPage from "./SecuritySettingsPage";

export default function SettingsPage({ onClose }) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    // 2. Change outer div to motion.div for the Backdrop Animation
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="custom-blur fixed inset-0 z-80 flex items-center justify-center bg-white/50 md:p-4 dark:bg-gray-950/50"
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
        className="relative"
      >
        {/* 3. Change inner div to motion.div for the Modal Card Animation */}
        <div className="mx-auto flex h-full w-92 flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-2xl md:h-138 md:w-full md:min-w-3xl md:flex-row md:border md:border-gray-200 dark:bg-gray-900 dark:md:border-gray-800">
          {/* Side Navigation */}
          <div className="w-full border-b border-gray-200 bg-white/50 p-4 md:w-1/4 md:border-r md:border-b-0 dark:border-gray-800 dark:bg-gray-950/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Settings
            </h3>
            <nav className="flex flex-row items-center justify-center space-x-2 overflow-x-auto pb-2 md:flex-col md:space-y-2 md:space-x-0 md:overflow-x-visible md:pb-0">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex shrink-0 items-center space-x-2 rounded-lg p-2 text-left text-sm font-medium whitespace-nowrap transition-colors md:w-full ${
                  activeTab === "general"
                    ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
              >
                <CircleUserRound className="h-5 w-5" />
                <span className="mt-0.5 md:mt-0">General</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex shrink-0 items-center space-x-2 rounded-lg p-2 text-left text-sm font-medium whitespace-nowrap transition-colors md:w-full ${
                  activeTab === "security"
                    ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
              >
                <ShieldUser className="h-5 w-5" />
                <span className="mt-0.5 md:mt-0">Security</span>
              </button>
            </nav>
          </div>

          {/* Content Panel */}
          <div className="w-full grow overflow-y-auto p-4 md:w-3/4 md:grow-0 md:p-8">
            {activeTab === "general" && <GeneralSettingsPage />}
            {activeTab === "security" && <SecuritySettingsPage />}
          </div>
        </div>

        {/* Close Icon - (Optional) We can animate this too or let it move with the container */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full p-1.5 text-gray-900 transition-colors hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-400"
          aria-label="Close dialog"
        >
          <X className="h-6 w-6" />
        </button>
      </motion.div>
    </motion.div>
  );
}
