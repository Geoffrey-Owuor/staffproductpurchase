"use client";
import ReusableSidebar from "../ReuseSideBar/ReusableSideBar";
import DashboardFooter from "../DashboardFooter";
import { useState } from "react";
import MobileHeader from "../Mobile/MobileHeader";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import UserContext from "@/context/UserContext";
import ChangeLogAlert from "@/components/ChangeLog/ChangeLogAlert";

export default function ReusableLayoutShell({ user, children }) {
  const [sidebarOpen, setSideBarOpen] = useState(true);
  const [showTopbar, setShowTopbar] = useState(false);

  //Hook used to track user inactivity so as to automatically logout
  useInactivityTimer(20 * 60 * 1000, user); //20 minutes in milliseconds for security reasons

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };

  const toggleTopbarView = () => {
    setShowTopbar((prev) => !prev);
  };

  const mainMarginClass = showTopbar
    ? ""
    : sidebarOpen
      ? "custom:ml-58"
      : "custom:ml-14";
  return (
    <UserContext.Provider value={user}>
      <ChangeLogAlert />
      <div className="containerizing flex min-h-screen flex-col">
        <MobileHeader />
        <ReusableSidebar
          isOpen={sidebarOpen}
          showTopbar={showTopbar}
          toggleTopbarView={toggleTopbarView}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex flex-1 pb-4">
          <main
            className={`min-w-0 flex-1 px-2 transition-all duration-200 ${mainMarginClass}`}
          >
            <div
              className={`${showTopbar ? "custom:mt-16" : "custom:mt-2"} mt-16`}
            >
              {children}
            </div>
          </main>
        </div>
        <div className={`${mainMarginClass} transition-all duration-200`}>
          <DashboardFooter />
        </div>
      </div>
    </UserContext.Provider>
  );
}
