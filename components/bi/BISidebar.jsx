"use client";

import { FileBarChart, HomeIcon, LogOutIcon } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LoadingLine from "../Reusables/LoadingLine";
import { useFinishLoading } from "@/app/hooks/useFinishLoading";

export default function BISidebar({ isOpen }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

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

  const isActive = (href) => {
    const active =
      href === "/bidashboard" ? pathname === href : pathname.startsWith(href);

    return active
      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white";
  };

  const handleLinkClick = () => {
    setIsLoading(true);
  };

  useFinishLoading(isLoading, setIsLoading, pathname);

  return (
    <>
      <LoadingLine isLoading={isLoading} />
      <div
        className={`fixed top-0 bottom-0 left-0 flex w-56 flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-700 dark:bg-gray-950 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Navigation Links */}
        <nav className="mt-20 flex-grow px-3">
          <ul className="space-y-1">
            <li>
              <Link
                href="/bidashboard"
                onClick={handleLinkClick}
                className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${isActive(
                  "/bidashboard",
                )}`}
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/bidashboard/purchases-history"
                onClick={handleLinkClick}
                className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${isActive(
                  "/bidashboard/purchases-history",
                )}`}
              >
                <FileBarChart className="h-4 w-4" />
                Purchases History
              </Link>
            </li>
          </ul>
        </nav>
        {/* Logout Button at Bottom */}
        <div className="p-3">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            {loggingOut ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent dark:border-white dark:border-t-transparent"></div>
                Logging Out...
              </>
            ) : (
              <>
                <LogOutIcon className="h-4 w-4" />
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
