"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOutIcon, Palette, Settings } from "lucide-react";
import SettingsPage from "../Settings/SettingsPage";
import { useUser } from "@/context/UserContext";
import ThemeToggle from "./ThemeProviders/ThemeToggle";
import { LoggingOutOverlay } from "./LoadingBar";

export default function UserMenu({ isSidebarOpen, hideMobileMenu }) {
  const user = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // 2. Add mounted state for Next.js SSR safety
  const [mounted, setMounted] = useState(false);

  const menuRef = useRef(null);

  const roleDisplayMap = {
    hr: "HR & Admin",
    cc: "Credit Control",
    bi: "Billing & Invoice",
    staff: "Staff",
  };
  // Close when clicking outside
  useEffect(() => {
    // Set mounted to true once on client
    setMounted(true);
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
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Logout display overlay in a portal */}
      {mounted &&
        createPortal(
          <LoggingOutOverlay isLoggingOut={loggingOut} />,
          document.body,
        )}
      <div className="relative" ref={menuRef}>
        {/* Toggle button */}
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex cursor-default items-center justify-between gap-2 rounded-xl p-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm text-white dark:bg-gray-100 dark:text-gray-950">
            <span className="mb-0 sm:mb-0.5">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
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
          <ChevronsUpDown className="h-5 w-5" />
        </div>
        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && user && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="absolute bottom-full -left-0.5 z-50 mt-2 mb-2 w-52.5 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                <p className="max-w-40 truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="max-w-40 truncate text-xs text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {roleDisplayMap[user.role] ||
                    user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>

              <div className="p-2">
                <div className="flex w-full items-center space-x-1 rounded-lg px-2 py-2 text-gray-800 dark:text-white">
                  <Palette className="h-5 w-5 shrink-0" />
                  <span>Theme </span>
                  <div className="mt-1 ml-2">
                    <ThemeToggle />
                  </div>
                </div>
                <button
                  onClick={() => {
                    hideMobileMenu?.();
                    setShowUserSettings(true);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center space-x-1 rounded-xl px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Settings className="h-5 w-5 text-gray-800 dark:text-white" />
                  <span className="text-gray-800 dark:text-white">
                    Account Settings
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-1 rounded-xl px-2 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-600/15"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* 4. Use createPortal to move the modal outside the sidebar div */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {showUserSettings && (
              <SettingsPage onClose={() => setShowUserSettings(false)} />
            )}
          </AnimatePresence>,
          document.body, // Render this at the end of the <body> tag
        )}
    </>
  );
}
