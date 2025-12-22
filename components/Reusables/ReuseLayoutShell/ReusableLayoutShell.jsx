"use client";
import ReusableSidebar from "../ReuseSideBar/ReusableSideBar";
import DashboardFooter from "../DashboardFooter";
import MobileHeader from "../Mobile/MobileHeader";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import UserContext from "@/context/UserContext";
import ChangeLogAlert from "@/components/ChangeLog/ChangeLogAlert";
import { useLayout } from "@/context/LayoutContext";

export default function ReusableLayoutShell({ user, children }) {
  const { sidebarOpen, showTopbar } = useLayout();

  //Hook used to track user inactivity so as to automatically logout
  useInactivityTimer(20 * 60 * 1000, user); //20 minutes in milliseconds for security reasons

  const mainMarginClass = showTopbar
    ? ""
    : sidebarOpen
      ? "custom:left-58 custom:top-2"
      : "custom:left-14 custom:top-2";

  return (
    <UserContext.Provider value={user}>
      <ChangeLogAlert />
      <div className="flex min-h-screen flex-col">
        <MobileHeader />
        <ReusableSidebar />
        <main
          className={`fixed right-2 ${mainMarginClass} bg-base-classes top-16 bottom-4 left-2 overflow-auto rounded-3xl border border-gray-300 px-2 transition-all duration-200 sm:bottom-2 sm:rounded-xl dark:border-gray-800`}
        >
          <div className={`containerizing mt-2 flex-1`}>{children}</div>
          <DashboardFooter />
        </main>
      </div>
    </UserContext.Provider>
  );
}
