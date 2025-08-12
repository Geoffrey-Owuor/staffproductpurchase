"use client";
import CCHeader from "./CCHeader";
import CCSidebar from "./CCSidebar";
import { useState } from "react";
import DashboardFooter from "../Reusables/DashboardFooter";
import { useSessionExpiry } from "@/app/hooks/useSessionExpiry";
import ExpiredSessionOverlay from "../Reusables/ExpiredSessionOverlay";

export default function CCLayoutShell({ user, children }) {
  const [sidebarOpen, setSideBarOpen] = useState(true);
  const expired = useSessionExpiry(user?.expiresAt);

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };
  return (
    <>
      {expired && <ExpiredSessionOverlay />}
      <div className="flex min-h-screen flex-col">
        <CCHeader isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <CCSidebar isOpen={sidebarOpen} />
          <main
            className={`flex-1 overflow-x-hidden ${sidebarOpen ? "ml-56" : "ml-0"}`}
          >
            <div className="mt-12">{children}</div>
          </main>
        </div>
        <DashboardFooter isSidebarOpen={sidebarOpen} />
      </div>
    </>
  );
}
