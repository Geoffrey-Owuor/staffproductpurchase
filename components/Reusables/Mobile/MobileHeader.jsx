"use client";

import {
  X,
  HomeIcon,
  ShoppingBagIcon,
  MessageCircleQuestion,
  History,
  Link2,
  ChevronsLeft,
  BookOpenCheck,
  Menu,
  NotebookText,
} from "lucide-react";
import HotpointLogo from "../HotpointLogo";
import { useLoadingLine } from "@/context/LoadingLineContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import UserMenu from "../UserMenu";
import { UseHandleHomeRoute } from "@/utils/HandleActionClicks/UseHandleHomeRoute";
import { UseHandleHistoryRoute } from "@/utils/HandleActionClicks/UseHandleHistoryRoute";
import { useUser } from "@/context/UserContext";

export default function MobileHeader() {
  // --- State and logic for Mobile Sidebar ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { role } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading } = useLoadingLine();

  // UseEffect to disable scrolling when sidebar is open (for screens wider than 640px)
  useEffect(() => {
    if (isMobileMenuOpen && window.innerWidth >= 640) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.documentElement.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const { handleHomeRoute, homePath } = UseHandleHomeRoute();
  const { handleHistoryRoute, historyPath } = UseHandleHistoryRoute();

  const handleHomeClick = () => {
    const isSameRoute = homePath === pathname;
    if (!isSameRoute) {
      startLoading();
      handleHomeRoute();
    }
    setIsMobileMenuOpen(false); // Close menu on click
  };

  const handleHistoryClick = () => {
    const isSameRoute = historyPath === pathname;
    if (!isSameRoute) {
      startLoading();
      handleHistoryRoute();
    }
    setIsMobileMenuOpen(false); // Close menu on click
  };

  // Generic handler for other links
  const handleNavClick = (path) => {
    const isSameRoute = path === pathname;
    if (!isSameRoute) {
      startLoading();
      router.push(path);
    }
    setIsMobileMenuOpen(false); // Close menu on click
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="custom:hidden fixed right-0 left-0 z-50 transition-all duration-200 ease-in-out">
        <div className="flex items-center justify-between border-gray-800 p-3">
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              title="Open menu"
              className="rounded-full p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <HotpointLogo />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              aria-label="Go back"
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>
            <a
              href="https://drive.google.com/drive/folders/1GdDpICwn6nA-51uKcubAa3YiNDrxqcAi?usp=drive_link"
              target="_blank"
              title="Check manual"
              aria-label="Check manual"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            >
              <NotebookText className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* --- Mobile Sidebar (Drawer) --- */}

      {/* Sidebar Backdrop */}
      <div
        className={`custom:hidden fixed inset-0 z-60 bg-black/50 transition-opacity duration-200 ease-in-out dark:bg-black/60 ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Sidebar Content */}
      <div
        className={`custom:hidden fixed top-0 bottom-0 left-0 z-70 flex w-64 transform flex-col bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out dark:border-r dark:border-gray-700 dark:bg-gray-950 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 grow">
          <ul className="space-y-2">
            <li>
              <div
                onClick={handleHomeClick}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
              >
                <HomeIcon className="h-5 w-5 shrink-0" />
                <span>Home</span>
              </div>
            </li>

            {role === "staff" && (
              <li>
                <div
                  onClick={() => handleNavClick("/staffdashboard/new-purchase")}
                  className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                >
                  <ShoppingBagIcon className="h-5 w-5 shrink-0" />
                  <span>New Purchase</span>
                </div>
              </li>
            )}

            <li>
              <div
                onClick={handleHistoryClick}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
              >
                <History className="h-5 w-5 shrink-0" />
                <span>Purchases History</span>
              </div>
            </li>

            {role === "cc" && (
              <li>
                <div
                  onClick={() =>
                    handleNavClick("/ccdashboard/payment-tracking")
                  }
                  className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                >
                  <BookOpenCheck className="h-5 w-5 shrink-0" />
                  <span>Fully Approved</span>
                </div>
              </li>
            )}
          </ul>
        </nav>

        {/* Bottom Section (Help & User & Hotpoint Website Link) */}
        <div className="mt-6 space-y-4 pt-4">
          <a
            href="https://hotpoint.co.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
          >
            <Link2 className="h-5 w-5 shrink-0" />
            <span>Hotpoint Website</span>
          </a>
          <a
            href="mailto:helpdesk@hotpoint.co.ke"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800"
          >
            <MessageCircleQuestion className="h-5 w-5 shrink-0" />
            <span>Help & Support</span>
          </a>

          <div className="ml-1">
            <UserMenu
              hideMobileMenu={() => setIsMobileMenuOpen(false)}
              menuOpen={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
