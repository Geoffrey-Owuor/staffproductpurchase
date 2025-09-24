"use client";
import Sidebar from "./StaffSideBar";
import Header from "./StaffHeader";
import { useState } from "react";
import { useSessionExpiry } from "@/app/hooks/useSessionExpiry";
import ExpiredSessionOverlay from "../Reusables/ExpiredSessionOverlay";
import DashboardFooter from "../Reusables/DashboardFooter";
import UserContext from "@/context/UserContext";

export default function StaffLayoutShell({ children, user }) {
  const [sidebarOpen, setSideBarOpen] = useState(true);
  const expired = useSessionExpiry(user?.expiresAt);

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };
  return (
    <UserContext.Provider value={user}>
      {expired && <ExpiredSessionOverlay />}
      <div className="flex min-h-screen flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} />
          <main
            className={`flex-1 overflow-x-hidden px-4 transition-all duration-200 ${sidebarOpen ? "ml-56" : "mr-10 ml-26"}`}
          >
            <div className="mt-20">{children}</div>
          </main>
        </div>
        <DashboardFooter isSidebarOpen={sidebarOpen} />
      </div>
    </UserContext.Provider>
  );
}
