"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserMenu from "../Reusables/UserMenu";
import HotpointLogo from "../Reusables/HotpointLogo";
import LoadingLine from "../Reusables/LoadingLine";
import { useFinishLoading } from "@/app/hooks/useFinishLoading";
import ThemeToggleCompact from "../Reusables/ThemeProviders/ThemeToggleCompact";
import { LoggingOutOverlay } from "../Reusables/LoadingBar";

import { LogOut, PlusCircle, ChevronLeft, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLinkClick = (path) => {
    setIsLoading(true);
    router.push(path);
  };

  useFinishLoading(isLoading, setIsLoading, router);

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
        {/* User Information */}
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
          {/* New Purchase Link */}
          <button
            onClick={() => handleLinkClick("/staffdashboard/new-purchase")}
            className={`flex items-center rounded-xl bg-gray-900 px-3 py-2 text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200`}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="text-sm">New Purchase</span>
          </button>
          {/* Logout Button */}
          <button
            className="flex items-center rounded-xl border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </header>
      <LoadingLine isLoading={isLoading} />
    </>
  );
};

export default Header;
