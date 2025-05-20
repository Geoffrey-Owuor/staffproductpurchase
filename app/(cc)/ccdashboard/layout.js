"use client";
import CCHeader from "@/components/cc/CCHeader";
import CCSidebar from "@/components/cc/CCSidebar";
import { useState } from "react";
import DashboardFooter from "@/components/Reusables/DashboardFooter";

export default function layout({ children }) {
  const [sidebarOpen, setSideBarOpen] = useState(true);

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };
  return (
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
  );
}
