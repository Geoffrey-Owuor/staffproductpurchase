import { useState } from "react";
import { CircleUserRound, CircleX, ShieldUser } from "lucide-react";
import GeneralSettingsPage from "./GeneralSettingsPage";
import SecuritySettingsPage from "./SecuritySettingsPage";

export default function SettingsPage({ onClose }) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 p-4 backdrop-blur-sm dark:bg-gray-950/50">
      <div className="mx-auto flex h-138 w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        {/* Side Navigation */}
        <div className="w-1/4 border-r border-gray-200 bg-white/50 p-4 dark:border-gray-800 dark:bg-gray-950/50">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Settings
          </h3>
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center space-x-3 rounded-lg p-2 text-left text-sm font-medium transition-colors ${
                activeTab === "general"
                  ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
              }`}
            >
              <CircleUserRound className="h-5 w-5" />
              <span>General</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center space-x-3 rounded-lg p-2 text-left text-sm font-medium transition-colors ${
                activeTab === "security"
                  ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
              }`}
            >
              <ShieldUser className="h-5 w-5" />
              <span>Security</span>
            </button>
          </nav>
        </div>

        {/* Content Panel */}
        <div className="relative w-3/4 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 cursor-pointer text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
            aria-label="Close dialog"
          >
            <CircleX className="h-7 w-7" />
          </button>

          {/* Conditionally rendered content */}
          {activeTab === "general" && <GeneralSettingsPage />}
          {activeTab === "security" && <SecuritySettingsPage />}
        </div>
      </div>
    </div>
  );
}
