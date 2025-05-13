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
    <>
      <CCSidebar isOpen={sidebarOpen} />
      <CCHeader isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`mt-14 flex-grow ${sidebarOpen ? "ml-56" : "ml-0"}`}>
        {children}
      </main>
      <DashboardFooter isSidebarOpen={sidebarOpen} />
    </>
  );
}
