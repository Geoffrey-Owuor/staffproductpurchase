"use client";
import ReusableHeader from "../ReuseHeader/ReusableHeader";
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
        <ReusableHeader toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 pb-4">
          <ReusableSidebar isOpen={sidebarOpen} />
          <main
            className={`flex-1 px-4 transition-all duration-200 ${sidebarOpen ? "ml-56" : "mr-10 ml-26"}`}
          >
            <div className="mt-20">{children}</div>
          </main>
        </div>
        <DashboardFooter isSidebarOpen={sidebarOpen} />
      </div>
    </UserContext.Provider>
  );
}
