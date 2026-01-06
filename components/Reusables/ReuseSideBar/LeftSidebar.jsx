import {
  HomeIcon,
  ShoppingBagIcon,
  MessageCircleQuestion,
  History,
  Link2,
  BookOpenCheck,
  ChevronsLeft,
  ArrowUpWideNarrow,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import HotpointLogo from "../HotpointLogo";
import UserMenu from "../UserMenu";
import { useLayout } from "@/context/LayoutContext";

const LeftSidebar = ({
  router,
  handleHomeClick,
  handleHistoryClick,
  handlePurchaseClick,
  handleNavClick,
  activeTab,
  role,
}) => {
  const { sidebarOpen, setSidebarOpen, setShowTopbar } = useLayout();
  return (
    <div
      className={`custom:flex fixed top-0 bottom-0 left-0 z-50 hidden flex-col transition-all duration-200 ${sidebarOpen ? "w-58" : "w-14"
        }`}
    >
      <div className="relative flex grow flex-col">
        <div className="relative mt-2 flex px-4.5 pb-[11.5px]">
          {/* Hotpoint Logo */}
          <HotpointLogo isOpen={sidebarOpen} />

          <button
            onClick={() => router.back()}
            className={`absolute ${sidebarOpen ? "top-[1.5px] left-39" : "top-11 left-[13px]"} rounded-full bg-gray-100 p-1.5 text-gray-900 transition-all duration-200 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-white dark:hover:bg-gray-800`}
            title="Go back"
          >
            <ChevronsLeft className="h-4.5 w-4.5" />
          </button>

          {/* Toggling the sidebar */}

          <button
            className={`absolute ${sidebarOpen ? "top-[1.5px] left-48" : "top-20 left-[13px]"} rounded-lg bg-gray-100 p-1.5 text-gray-900 transition-all duration-200 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-white dark:hover:bg-gray-800`}
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4.5 w-4.5" />
            ) : (
              <PanelLeftOpen className="h-4.5 w-4.5" />
            )}
          </button>
        </div>

        {/* Navigation Buttons */}
        <nav
          className={`${sidebarOpen ? "mt-4" : "mt-20"} grow px-2 transition-all duration-200`}
        >
          <ul className="space-y-1">
            <li>
              <div
                onClick={handleHomeClick}
                className={`flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${activeTab === "home"
                  ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                  }`}
              >
                <HomeIcon className="h-4 w-4 shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarOpen ? "w-40" : "w-0"
                    }`}
                >
                  Home
                </span>
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
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarOpen ? "w-40" : "w-0"
                    }`}
                >
                  New Purchase
                </span>
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
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarOpen ? "w-40" : "w-0"
                    }`}
                >
                  Purchases History
                </span>
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
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarOpen ? "w-40" : "w-0"
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
          <div
            onClick={() => setShowTopbar((prev) => !prev)}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
          >
            <ArrowUpWideNarrow className="h-4 w-4 shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarOpen ? "w-40" : "w-0"
                }`}
            >
              Topbar View
            </span>
          </div>
          <a
            href="https://hotpoint.co.ke"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Link2 className="h-4 w-4 shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarOpen ? "w-40" : "w-0"
                }`}
            >
              Hotpoint Website
            </span>
          </a>
          <a
            href="mailto:helpdesk@hotpoint.co.ke"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800"
          >
            <MessageCircleQuestion className="h-4 w-4 shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarOpen ? "w-40" : "w-0"
                }`}
            >
              Help & Support
            </span>
          </a>

          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
