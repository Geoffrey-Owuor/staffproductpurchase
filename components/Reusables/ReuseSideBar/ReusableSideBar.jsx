"use client";

import {
  HomeIcon,
  ShoppingBagIcon,
  MessageCircleQuestion,
  Wallet2,
  History,
  Menu,
  Link2,
} from "lucide-react";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import HotpointLogo from "../HotpointLogo";
import UserMenu from "../UserMenu";
import LoadingLine from "../LoadingLine";
import { useFinishLoading } from "@/app/hooks/useFinishLoading";
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

  useFinishLoading(isLoading, setIsLoading);

  return (
    <>
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-700 dark:bg-gray-950 ${
          isOpen ? "w-56" : "w-14"
        }`}
      >
        <div className="relative flex flex-grow flex-col">
          {/* Toggling the sidebar */}
          <div
            className={`absolute top-60 transition-all duration-200 ${isOpen ? "left-52" : "left-10"}`}
          >
            <button
              className="rounded-full border border-gray-400 bg-white p-2 text-gray-900 hover:bg-gray-100 dark:border-gray-500 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
              onClick={toggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-2 flex px-4">
            {/* Hotpoint Logo */}
            <HotpointLogo isOpen={isOpen} />

            <a
              href="https://hotpoint.co.ke"
              className={`absolute ${isOpen ? "top-1 left-45" : "top-11 left-[13px]"} rounded-full p-1.5 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800/50 dark:hover:text-white`}
              title="Hotpoint Ecommerce Website"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Link2 className="h-4.5 w-4.5" />
            </a>
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
                    <Wallet2 className="h-4 w-4 flex-shrink-0" />
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
          {/* Help & Support & User Menu */}
          <div className="space-y-4 px-2 py-3">
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
