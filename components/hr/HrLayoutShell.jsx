"use client";
import HrHeader from "./HrHeader";
import HrSidebar from "./HrSidebar";
import { useState } from "react";
import DashboardFooter from "../Reusables/DashboardFooter";
import { useSessionExpiry } from "@/app/hooks/useSessionExpiry";
import ExpiredSessionOverlay from "../Reusables/ExpiredSessionOverlay";

export default function HrLayoutShell({ user, children }) {
  const [sidebarOpen, setSideBarOpen] = useState(true);
  const expired = useSessionExpiry(user?.expiresAt);

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };
  return (
    <>
      {expired && <ExpiredSessionOverlay />}
      <div className="flex min-h-screen flex-col">
        <HrHeader isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <HrSidebar isOpen={sidebarOpen} />
          <main
            className={`flex-1 overflow-x-hidden ${sidebarOpen ? "ml-56" : "ml-0"}`}
          >
            <div className="mt-16">{children}</div>
          </main>
        </div>
        <DashboardFooter isSidebarOpen={sidebarOpen} />
      </div>
    </>
  );
}
