"use client";

import { useState, useEffect, useRef } from "react";
import {
  LogOutIcon,
  MoreVertical,
  Palette,
  Settings,
  SlidersVertical,
} from "lucide-react";
import SettingsPage from "../UserSettings/SettingsPage";
import { useUser } from "@/context/UserContext";
import ThemeToggle from "./ThemeProviders/ThemeToggle";
import { LoggingOutOverlay } from "./LoadingBar";

export default function UserMenu({ isSidebarOpen }) {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
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

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  return (
    <>
      <LoggingOutOverlay isLoggingOut={loggingOut} />
      <div className="relative" ref={menuRef}>
        {/* Toggle button */}
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex cursor-default items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white"
        >
          <SlidersVertical className="h-4 w-4 flex-shrink-0" />
          <div
            className={`flex flex-col whitespace-nowrap transition-all duration-200 ${
              isSidebarOpen ? "w-40" : "w-0"
            }`}
          >
            <span className="max-w-[100px] truncate text-sm font-semibold">
              {user.name.toLowerCase()}
            </span>
            <span className="max-w-[100px] truncate text-xs">{user.email}</span>
          </div>
          <MoreVertical className="h-4 w-4" />
        </div>
        {/* Dropdown */}
        {isOpen && user && (
          <div className="absolute bottom-full -left-0.5 z-50 mt-2 mb-2 w-52.5 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <p className="max-w-[160px] truncate text-sm font-semibold text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="max-w-[160px] truncate text-xs text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {roleDisplayMap[user.role] ||
                  user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>

            <div className="p-2">
              <div className="flex w-full items-center space-x-1 rounded-lg px-2 py-2 text-gray-800 dark:text-white">
                <Palette className="h-5 w-5" />
                <span>Theme </span>
                <div className="mt-1 ml-2">
                  <ThemeToggle />
                </div>
              </div>
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
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-1 rounded-lg px-2 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-600/15"
              >
                <LogOutIcon className="h-5 w-5" />
                <span>Logout</span>
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
