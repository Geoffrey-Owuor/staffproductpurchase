"use client";
import ReusableSidebar from "../ReuseSideBar/ReusableSideBar";
import DashboardFooter from "../DashboardFooter";
import { useState } from "react";
import MobileHeader from "../Mobile/MobileHeader";
// import { useSessionExpiry } from "@/app/hooks/useSessionExpiry";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
// import ExpiredSessionOverlay from "../ExpiredSessionOverlay";
import UserContext from "@/context/UserContext";

export default function ReusableLayoutShell({ user, children }) {
  const [sidebarOpen, setSideBarOpen] = useState(true);
  // const expired = useSessionExpiry(user?.expiresAt);

  //Hook used to track user inactivity so as to automatically logout
  useInactivityTimer(5 * 60 * 1000, user); //5 minutes in milliseconds for security reasons

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };
  return (
    <UserContext.Provider value={user}>
      {/* {expired && <ExpiredSessionOverlay />} */}
      <div className="containerizing flex min-h-screen flex-col">
        <MobileHeader />
        <ReusableSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 pb-4">
          <main
            className={`min-w-0 flex-1 px-2 transition-all duration-200 ${sidebarOpen ? "md:ml-58" : "md:ml-16"}`}
          >
            <div className="mt-16 md:mt-4">{children}</div>
          </main>
        </div>
        <DashboardFooter isSidebarOpen={sidebarOpen} />
      </div>
    </UserContext.Provider>
  );
}
