"use client";
import ReusableSidebar from "../ReuseSideBar/ReusableSideBar";
import DashboardFooter from "../DashboardFooter";
import MobileHeader from "../Mobile/MobileHeader";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import UserContext from "@/context/UserContext";
import { useSidebarStore } from "@/store/useSidebarStore";
import ChangeLogAlert from "@/components/ChangeLog/ChangeLogAlert";

export default function ReusableLayoutShell({ user, children }) {
  const sidebarOpen = useSidebarStore((state) => state.sidebarOpen);
  const showTopbar = useSidebarStore((state) => state.showTopbar);

  //Hook used to track user inactivity so as to automatically logout
  useInactivityTimer(20 * 60 * 1000, user); //20 minutes in milliseconds for security reasons

  const mainMarginClass = showTopbar
    ? ""
    : sidebarOpen
      ? "custom:left-58 custom:top-0 custom:rounded-tr-none!"
      : "custom:left-14 custom:top-0 custom:rounded-tr-none!";

  return (
    <UserContext.Provider value={user}>
      <ChangeLogAlert />
      <div className="min-h-screen">
        <MobileHeader />
        <ReusableSidebar />
        <main
          className={`fixed right-0 ${mainMarginClass} bg-base-classes top-16 bottom-0 left-0 overflow-auto rounded-t-3xl border border-gray-300 px-2 transition-all duration-200 sm:rounded-t-2xl dark:border-gray-800`}
        >
          <div className="mx-auto mt-2 flex h-full max-w-7xl flex-col">
            <div className="flex-1">{children}</div>
            <DashboardFooter />
          </div>
        </main>
      </div>
    </UserContext.Provider>
  );
}
