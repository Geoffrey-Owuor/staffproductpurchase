"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserMenu from "../Reusables/UserMenu";
import HotpointLogo from "../Reusables/HotpointLogo";
import ThemeToggleCompact from "../Reusables/ThemeProviders/ThemeToggleCompact";
import { LoggingOutOverlay } from "../Reusables/LoadingBar";

import { LogOut, ChevronLeft, Menu } from "lucide-react";

const CCHeader = ({ toggleSidebar }) => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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
    }
  };

  return (
    <>
      <LoggingOutOverlay isLoggingOut={loggingOut} />
      <header
        className={`fixed top-0 right-0 left-0 z-50 flex h-14 items-center border-b border-gray-200 bg-white pr-6 pl-2 transition-all duration-200 dark:border-gray-700 dark:bg-gray-950`}
      >
        {/* Hotpoint Logo */}
        <HotpointLogo />
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="mr-10 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5 text-gray-700 dark:text-white" />
        </button>
        {/* User Menu */}
        <UserMenu />
        {/* Right side - Actions */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Theme Switcher */}
          <ThemeToggleCompact />
          {/* Go back Button */}
          <button
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5 text-gray-900 dark:text-white" />
          </button>
          {/* Logout Button */}
          <button
            className="flex items-center rounded-xl border border-gray-200 px-3 py-2 text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </header>
    </>
  );
};

export default CCHeader;
