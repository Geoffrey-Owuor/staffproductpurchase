"use client";
import BIHeader from "@/components/bi/BIHeader";
import BISidebar from "@/components/bi/BISidebar";
import DashboardFooter from "@/components/Reusables/DashboardFooter";
import { useState } from "react";
import { useSessionExpiry } from "@/app/hooks/useSessionExpiry";
import ExpiredSessionOverlay from "../Reusables/ExpiredSessionOverlay";

export default function BILayoutShell({ user, children }) {
  const [sidebarOpen, setSideBarOpen] = useState(true);
  const expired = useSessionExpiry(user?.expiresAt);

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };
  return (
    <>
      {expired && <ExpiredSessionOverlay />}
      <div className="flex min-h-screen flex-col">
        <BIHeader isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <BISidebar isOpen={sidebarOpen} />
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
