"use client";

import { useState, useEffect, useRef } from "react";
import { Settings, UserRoundCog } from "lucide-react";
import SettingsPage from "../UserSettings/SettingsPage";
import { useUser } from "@/context/UserContext";

export default function UserMenu() {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const menuRef = useRef(null);

  const roleDisplayMap = {
    hr: "HR & Admin",
    cc: "Credit Control",
    bi: "Billing & Invoice",
    staff: "Staff",
  };
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Toggle button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-900 transition hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <UserRoundCog className="h-5 w-5" />
        </button>
        {/* Dropdown */}
        {isOpen && user && (
          <div className="absolute z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-950">
            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {roleDisplayMap[user.role] ||
                  user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  setShowUserSettings(true);
                  setIsOpen(false);
                }}
                className="flex w-full items-center space-x-1 rounded-lg px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Settings className="h-5 w-5 text-gray-800 dark:text-white" />
                <span className="text-gray-800 dark:text-white">
                  Account Settings
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
      {showUserSettings && (
        <SettingsPage onClose={() => setShowUserSettings(false)} />
      )}
    </>
  );
}
