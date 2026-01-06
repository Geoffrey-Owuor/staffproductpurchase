"use client";
import {
  HomeIcon,
  ShoppingBagIcon,
  MessageCircleQuestion,
  History,
  Link2,
  BookOpenCheck,
  ChevronsLeft,
  ToggleLeft, // Changed icon to represent switching back to side view
} from "lucide-react";
import HotpointLogo from "../HotpointLogo";
import UserMenu from "../UserMenu";
import { useState, useEffect } from "react";
import { useLayout } from "@/context/LayoutContext";

const TopSidebar = ({
  router,
  handleHomeClick,
  handleHistoryClick,
  handlePurchaseClick,
  handleNavClick,
  activeTab,
  role,
}) => {
  // --- State for header scroll effect ---
  const [isScrolled, setIsScrolled] = useState(false);
  const { setShowTopbar } = useLayout();

  const toggleTopbarView = () => {
    setShowTopbar(false);
  };

  //   UseEffect to detect page scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`custom:flex fixed top-0 right-0 left-0 z-50 hidden h-16 transition-all duration-200 ${isScrolled ? "custom-blur shadow-xs" : ""
        }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4">
        {/* LEFT SECTION: Logo & Back Button */}
        <div className="flex items-center gap-4">
          {/* Pass isOpen={true} to ensure full logo is always visible */}
          <div className="shrink-0">
            <HotpointLogo isOpen={true} />
          </div>
        </div>

        {/* MIDDLE SECTION: Navigation Tabs */}
        <nav>
          <ul className="flex items-center space-x-1">
            <li>
              <div
                onClick={handleHomeClick}
                className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${activeTab === "home"
                  ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                  }`}
              >
                <HomeIcon className="h-4 w-4 shrink-0" />
                <span>Home</span>
              </div>
            </li>

            <li>
              <div
                onClick={handlePurchaseClick}
                className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${activeTab === "newpurchase"
                  ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                  }`}
              >
                <ShoppingBagIcon className="h-4 w-4 shrink-0" />
                <span>New Purchase</span>
              </div>
            </li>

            <li>
              <div
                onClick={handleHistoryClick}
                className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${activeTab === "history"
                  ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                  }`}
              >
                <History className="h-4 w-4 shrink-0" />
                <span>History</span>
              </div>
            </li>

            {role === "cc" && (
              <li>
                <div
                  onClick={() =>
                    handleNavClick("/ccdashboard/payment-tracking")
                  }
                  className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${activeTab === "paymentTracking"
                    ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                    }`}
                >
                  <BookOpenCheck className="h-4 w-4 shrink-0" />
                  <span>Fully Approved</span>
                </div>
              </li>
            )}
          </ul>
        </nav>

        {/* RIGHT SECTION: Utilities & User Menu */}
        <div className="flex items-center gap-3">
          {/* Go back button */}
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800/50 dark:hover:text-white"
            title="Go back"
          >
            <ChevronsLeft className="h-5 w-5" />
          </button>
          {/* Sidebar View Toggle */}
          <div
            onClick={toggleTopbarView}
            title="Switch to Side View"
            className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
          >
            <ToggleLeft className="h-5 w-5" />
          </div>

          <div className="hidden h-6 w-px bg-gray-200 sm:block dark:bg-gray-700"></div>

          {/* Website Link */}
          <a
            href="https://hotpoint.co.ke"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Link2 className="h-4 w-4 shrink-0" />
            <span className="hidden xl:inline">Website</span>
          </a>

          {/* Help Link */}
          <a
            href="mailto:helpdesk@hotpoint.co.ke"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800"
          >
            <MessageCircleQuestion className="h-4 w-4 shrink-0" />
            <span className="hidden xl:inline">Help</span>
          </a>

          {/* User Menu */}
          <div className="pl-2">
            {/* isSidebarOpen={true} ensures full user details are shown */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopSidebar;
