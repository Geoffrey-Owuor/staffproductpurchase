"use client";
import BIHeader from "@/components/bi/BIHeader";
import BISidebar from "@/components/bi/BISidebar";
import DashboardFooter from "@/components/Reusables/DashboardFooter";
import { useState } from "react";

export default function layout({ children }) {
  const [sidebarOpen, setSideBarOpen] = useState(true);

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };
  return (
    <div className="flex min-h-screen flex-col">
      <BIHeader isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <BISidebar isOpen={sidebarOpen} />
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
