"use client";
import HrHeader from "@/components/hr/HrHeader";
import HrSidebar from "@/components/hr/HrSidebar";
import { useState } from "react";
import DashboardFooter from "@/components/Reusables/DashboardFooter";

export default function layout({ children }) {
  const [sidebarOpen, setSideBarOpen] = useState(true);

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };
  return (
    <>
      <HrSidebar isOpen={sidebarOpen} />
      <HrHeader isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`mt-14 flex-grow pb-3 ${sidebarOpen ? "ml-56" : "ml-0"}`}
      >
        {children}
      </main>
      <DashboardFooter isSidebarOpen={sidebarOpen} />
    </>
  );
}
