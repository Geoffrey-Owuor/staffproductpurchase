"use client";

import {
  HomeIcon,
  ShoppingBagIcon,
  MessageCircleQuestion,
  History,
  Menu,
  Link2,
  BookOpenCheck,
  ChevronsLeft,
} from "lucide-react";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import HotpointLogo from "../HotpointLogo";
import UserMenu from "../UserMenu";
import LoadingLine from "../LoadingLine";
import { useFinishLoading } from "@/hooks/useFinishLoading";
import { UseHandleHomeRoute } from "@/utils/HandleActionClicks/useHandleHomeRoute";
import { UseHandleHistoryRoute } from "@/utils/HandleActionClicks/useHandleHistoryRoute";
import { useUser } from "@/context/UserContext";

export default function ReusableSidebar({ isOpen, toggleSidebar }) {
  const { role } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleHomeRoute = UseHandleHomeRoute();
  const handleHistoryRoute = UseHandleHistoryRoute();

  //Determining active tabs
  const pathname = usePathname();
  let activeTab = "";

  const homeRoutes = [
    "/staffdashboard",
    "/payrolldashboard",
    "/hrdashboard",
    "/ccdashboard",
    "/bidashboard",
  ];
  const historyRoutes = [
    "/staffdashboard/purchase-history",
    "/payrolldashboard/purchases-history",
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
  } else if (pathname === "/ccdashboard/payment-tracking") {
    activeTab = "paymentTracking";
  }

  const handleHomeClick = () => {
    setIsLoading(true);
    handleHomeRoute();
  };

  const handleHistoryClick = () => {
    setIsLoading(true);
    handleHistoryRoute();
  };

  // Hook for managing the new purchase shortcut
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for alt + N
      if (event.altKey & (event.key === "n")) {
        // Prevent browsers default new window action
        event.preventDefault();

        //check if user is allowed to use this shortcut
        if (role === "staff") {
          setIsLoading(true);
          router.push("/staffdashboard/new-purchase");
        }
      }
    };

    // Add an event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    // remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [role, router]); //dependencies

  useFinishLoading(isLoading, setIsLoading);

  return (
    <>
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 hidden flex-col border-r border-gray-200 bg-white transition-all duration-200 md:flex dark:border-gray-700 dark:bg-gray-950 ${
          isOpen ? "w-56" : "w-14"
        }`}
      >
        <div className="relative flex flex-grow flex-col">
          {/* Toggling the sidebar */}
          <div
            className={`absolute top-60 transition-all duration-200 ${isOpen ? "left-52" : "left-10"}`}
          >
            <button
              className="rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700 dark:border dark:border-gray-500 dark:bg-gray-950 dark:hover:bg-gray-900"
              onClick={toggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-2 flex px-4">
            {/* Hotpoint Logo */}
            <HotpointLogo isOpen={isOpen} />

            <button
              onClick={() => router.back()}
              className={`absolute ${isOpen ? "top-1 left-45" : "top-11 left-[13px]"} rounded-full p-1.5 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800/50 dark:hover:text-white`}
              title="Go back"
            >
              <ChevronsLeft className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Navigation Buttons */}
          <nav
            className={`${isOpen ? "mt-6" : "mt-12"} flex-grow px-2 transition-all duration-200`}
          >
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
                    className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
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
                  <History className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                      isOpen ? "w-40" : "w-0"
                    }`}
                  >
                    Purchases History
                  </span>
                </div>
              </li>
              {role === "cc" && (
                <li>
                  <div
                    onClick={() => {
                      setIsLoading(true);
                      router.push("/ccdashboard/payment-tracking");
                    }}
                    className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === "paymentTracking"
                        ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                    }`}
                  >
                    <BookOpenCheck className="h-4 w-4 flex-shrink-0" />
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                        isOpen ? "w-40" : "w-0"
                      }`}
                    >
                      Fully Approved
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </nav>
          {/* Help & Support Hotpoint Website & User Menu */}
          <div className="space-y-4 px-2 py-3">
            <a
              href="https://hotpoint.co.ke"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Link2 className="h-4 w-4 flex-shrink-0" />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                  isOpen ? "w-40" : "w-0"
                }`}
              >
                Hotpoint Website
              </span>
            </a>
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

            <UserMenu isSidebarOpen={isOpen} />
          </div>
        </div>
      </div>
      <LoadingLine isLoading={isLoading} />
    </>
  );
}
