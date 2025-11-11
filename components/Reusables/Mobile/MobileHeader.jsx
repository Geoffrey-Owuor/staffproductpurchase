"use client";

import {
  Menu,
  X,
  HomeIcon,
  ShoppingBagIcon,
  MessageCircleQuestion,
  History,
  Link2,
  ChevronsLeft,
  BookOpenCheck,
} from "lucide-react";
import HotpointLogo from "../HotpointLogo";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserMenu from "../UserMenu";
import LoadingLine from "../LoadingLine";
import { useFinishLoading } from "@/hooks/useFinishLoading";
import { UseHandleHomeRoute } from "@/utils/HandleActionClicks/useHandleHomeRoute";
import { UseHandleHistoryRoute } from "@/utils/HandleActionClicks/useHandleHistoryRoute";
import { useUser } from "@/context/UserContext";

export default function MobileHeader() {
  // --- State for header scroll effect ---
  const [isScrolled, setIsScrolled] = useState(false);

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

  // --- State and logic for Mobile Sidebar ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { role } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleHomeRoute = UseHandleHomeRoute();
  const handleHistoryRoute = UseHandleHistoryRoute();

  const handleHomeClick = () => {
    setIsLoading(true);
    handleHomeRoute();
    setIsMobileMenuOpen(false); // Close menu on click
  };

  const handleHistoryClick = () => {
    setIsLoading(true);
    handleHistoryRoute();
    setIsMobileMenuOpen(false); // Close menu on click
  };

  // Generic handler for other links
  const handleNavClick = (path) => {
    setIsLoading(true);
    router.push(path);
    setIsMobileMenuOpen(false); // Close menu on click
  };

  useFinishLoading(isLoading, setIsLoading);

  return (
    <>
      {/* --- Mobile Header Bar --- */}
      <div
        className={`fixed right-0 left-0 z-50 h-14 transition-all duration-200 ease-in-out md:hidden ${
          isScrolled
            ? "custom-blur bg-white/50 shadow-xs dark:bg-gray-950/50"
            : "bg-white dark:bg-gray-950"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <HotpointLogo />
          <div className="flex items-center space-x-10">
            <button
              onClick={() => router.back()}
              className="text-gray-900 dark:text-white"
              aria-label="Go back"
            >
              <ChevronsLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              className="text-gray-900 dark:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Sidebar (Drawer) --- */}

      {/* Sidebar Backdrop */}
      <div
        className={`custom-blur fixed inset-0 z-[60] bg-white/50 transition-opacity duration-200 ease-in-out md:hidden dark:bg-black/50 ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[70] flex w-64 transform flex-col bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out md:hidden dark:border-l dark:border-gray-700 dark:bg-gray-950 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
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
        <nav className="mt-6 flex-grow">
          <ul className="space-y-2">
            <li>
              <div
                onClick={handleHomeClick}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
              >
                <HomeIcon className="h-5 w-5 flex-shrink-0" />
                <span>Home</span>
              </div>
            </li>

            {role === "staff" && (
              <li>
                <div
                  onClick={() => handleNavClick("/staffdashboard/new-purchase")}
                  className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                >
                  <ShoppingBagIcon className="h-5 w-5 flex-shrink-0" />
                  <span>New Purchase</span>
                </div>
              </li>
            )}

            <li>
              <div
                onClick={handleHistoryClick}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
              >
                <History className="h-5 w-5 flex-shrink-0" />
                <span>Purchases History</span>
              </div>
            </li>

            {role === "cc" && (
              <li>
                <div
                  onClick={() =>
                    handleNavClick("/ccdashboard/payment-tracking")
                  }
                  className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                >
                  <BookOpenCheck className="h-5 w-5 flex-shrink-0" />
                  <span>Track Payments</span>
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
            <Link2 className="h-5 w-5 flex-shrink-0" />
            <span>Hotpoint Website</span>
          </a>
          <a
            href="mailto:helpdesk@hotpoint.co.ke"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800"
          >
            <MessageCircleQuestion className="h-5 w-5 flex-shrink-0" />
            <span>Help & Support</span>
          </a>

          <div className="ml-1">
            <UserMenu
              isSidebarOpen={true}
              hideMobileMenu={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      </div>
      <LoadingLine isLoading={isLoading} />
    </>
  );
}
