"use client";
import ReusableSidebar from "../ReuseSideBar/ReusableSideBar";
import DashboardFooter from "../DashboardFooter";
import { useState } from "react";
import { useSessionExpiry } from "@/app/hooks/useSessionExpiry";
import ExpiredSessionOverlay from "../ExpiredSessionOverlay";
import UserContext from "@/context/UserContext";

export default function ReusableLayoutShell({ user, children }) {
  const [sidebarOpen, setSideBarOpen] = useState(true);
  const expired = useSessionExpiry(user?.expiresAt);

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };
  return (
    <UserContext.Provider value={user}>
      {expired && <ExpiredSessionOverlay />}
      <div className="flex min-h-screen flex-col">
        <ReusableSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 pb-4">
          <main
            className={`min-w-0 flex-1 px-4 transition-all duration-200 ${sidebarOpen ? "ml-56" : "ml-16"}`}
          >
            <div className="mt-4">{children}</div>
          </main>
        </div>
        <DashboardFooter isSidebarOpen={sidebarOpen} />
      </div>
    </UserContext.Provider>
  );
}
