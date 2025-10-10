"use client";

import {
  FileBarChart,
  HomeIcon,
  LogOutIcon,
  MessageCircleQuestion,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LoadingLine from "../Reusables/LoadingLine";
import { useFinishLoading } from "@/app/hooks/useFinishLoading";
import { LoggingOutOverlay } from "../Reusables/LoadingBar";

export default function CCSidebar({ isOpen }) {
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
      href === "/ccdashboard" ? pathname === href : pathname.startsWith(href);

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
      <LoggingOutOverlay isLoggingOut={loggingOut} />
      <LoadingLine isLoading={isLoading} />
      <div
        className={`fixed top-0 bottom-0 left-0 flex flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-700 dark:bg-gray-950 ${
          isOpen ? "w-56" : "w-16"
        }`}
      >
        {/* Navigation Links */}
        <nav className="mt-20 flex-grow px-3">
          <ul className="space-y-1">
            <li>
              <Link
                href="/ccdashboard"
                onClick={handleLinkClick}
                className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${isActive(
                  "/ccdashboard",
                )}`}
              >
                <HomeIcon className="h-4 w-4 flex-shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                    isOpen ? "w-40" : "w-0"
                  }`}
                >
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/ccdashboard/purchases-history"
                onClick={handleLinkClick}
                className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${isActive(
                  "/ccdashboard/purchases-history",
                )}`}
              >
                <FileBarChart className="h-4 w-4 flex-shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                    isOpen ? "w-40" : "w-0"
                  }`}
                >
                  Purchases History
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button at Bottom, Help & Support */}
        <div className="space-y-4 p-3">
          <a
            href="mailto:helpdesk@hotpoint.co.ke"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800"
          >
            <MessageCircleQuestion className="h-4 w-4 flex-shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                isOpen ? "w-40" : "w-0"
              }`}
            >
              Help & Support
            </span>
          </a>
          <div
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <LogOutIcon className="h-4 w-4 flex-shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                isOpen ? "w-40" : "w-0"
              }`}
            >
              Logout
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
