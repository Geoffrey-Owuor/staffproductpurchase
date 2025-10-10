"use client";

import {
  FileBarChart,
  HomeIcon,
  LogOutIcon,
  ShoppingBagIcon,
  MessageCircleQuestion,
  HandCoins,
} from "lucide-react";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LoadingLine from "../LoadingLine";
import { useFinishLoading } from "@/app/hooks/useFinishLoading";
import { LoggingOutOverlay } from "../LoadingBar";
import { UseHandleHomeRoute } from "@/utils/HandleActionClicks/useHandleHomeRoute";
import { UseHandleHistoryRoute } from "@/utils/HandleActionClicks/useHandleHistoryRoute";
import { useUser } from "@/context/UserContext";

export default function ReusableSidebar({ isOpen }) {
  const { role } = useUser();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleHomeRoute = UseHandleHomeRoute();
  const handleHistoryRoute = UseHandleHistoryRoute();

  //Determining active tabs
  const pathname = usePathname();
  let activeTab = "";

  const homeRoutes = [
    "/staffdashboard",
    "/hrdashboard",
    "/ccdashboard",
    "/bidashboard",
  ];
  const historyRoutes = [
    "/staffdashboard/purchase-history",
    "/hrdashboard/requests-history",
    "/ccdashboard/purchases-history",
    "/bidashboard/purchases-history",
  ];

  if (homeRoutes.includes(pathname)) {
    activeTab = "home";
  } else if (historyRoutes.includes(pathname)) {
    activeTab = "history";
  } else if (pathname === "/staffdashboard/new-purchase") {
    activeTab = "newpurchase";
  } else if (pathname === "/hrdashboard/payment-tracking") {
    activeTab = "paymentTracking";
  }

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

  const handleHomeClick = () => {
    setIsLoading(true);
    handleHomeRoute();
  };

  const handleHistoryClick = () => {
    setIsLoading(true);
    handleHistoryRoute();
  };

  useFinishLoading(isLoading, setIsLoading);

  return (
    <>
      <LoggingOutOverlay isLoggingOut={loggingOut} />
      <LoadingLine isLoading={isLoading} />
      <div
        className={`fixed top-0 bottom-0 left-0 flex flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-700 dark:bg-gray-950 ${
          isOpen ? "w-56" : "w-16"
        }`}
      >
        {/* Navigation Buttons */}
        <nav className="mt-20 flex-grow px-3">
          <ul className="space-y-1">
            <li>
              <div
                onClick={handleHomeClick}
                className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "home"
                    ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
              >
                <HomeIcon className="h-4 w-4 flex-shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                    isOpen ? "w-40" : "w-0"
                  }`}
                >
                  Home
                </span>
              </div>
            </li>
            {role === "staff" && (
              <li>
                <div
                  onClick={() => {
                    setIsLoading(true);
                    router.push("/staffdashboard/new-purchase");
                  }}
                  className={`flex cursor-default items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === "newpurchase"
                      ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                  }`}
                >
                  <ShoppingBagIcon className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                      isOpen ? "w-40" : "w-0"
                    }`}
                  >
                    New Purchase
                  </span>
                </div>
              </li>
            )}
            <li>
              <div
                onClick={handleHistoryClick}
                className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "history"
                    ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
              >
                <FileBarChart className="h-4 w-4 flex-shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                    isOpen ? "w-40" : "w-0"
                  }`}
                >
                  Purchases History
                </span>
              </div>
            </li>
            {role === "hr" && (
              <li>
                <div
                  onClick={() => {
                    setIsLoading(true);
                    router.push("/hrdashboard/payment-tracking");
                  }}
                  className={`flex cursor-default items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === "paymentTracking"
                      ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                  }`}
                >
                  <HandCoins className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                      isOpen ? "w-40" : "w-0"
                    }`}
                  >
                    Track Payments
                  </span>
                </div>
              </li>
            )}
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
            className="flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
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
