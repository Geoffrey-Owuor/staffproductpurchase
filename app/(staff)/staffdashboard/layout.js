"use client";
import Sidebar from "@/components/staff/StaffSideBar";
import Header from "@/components/staff/StaffHeader";
import { useState } from "react";
import DashboardFooter from "@/components/Reusables/DashboardFooter";

export default function layout({ children }) {
  const [sidebarOpen, setSideBarOpen] = useState(true);

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };
  return (
    <>
      <Sidebar isOpen={sidebarOpen} />
      <Header isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`mt-14 flex-grow pb-3 ${sidebarOpen ? "ml-56" : "ml-0"}`}
      >
        {children}
      </main>
      <DashboardFooter isSidebarOpen={sidebarOpen} />
    </>
  );
}
