"use client";
import BIHeader from "./BIHeader";
import BISidebar from "./BISidebar";
import DashboardFooter from "../Reusables/DashboardFooter";
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
        <BIHeader toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <BISidebar isOpen={sidebarOpen} />
          <main
            className={`flex-1 overflow-x-hidden transition-all duration-200 ${sidebarOpen ? "ml-56" : "ml-0"}`}
          >
            <div className="mt-20">{children}</div>
          </main>
        </div>
        <DashboardFooter isSidebarOpen={sidebarOpen} />
      </div>
    </>
  );
}
