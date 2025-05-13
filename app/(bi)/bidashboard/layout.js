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
    <>
      <BISidebar isOpen={sidebarOpen} />
      <BIHeader isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`mt-14 flex-grow ${sidebarOpen ? "ml-56" : "ml-0"}`}>
        {children}
      </main>
      <DashboardFooter isSidebarOpen={sidebarOpen} />
    </>
  );
}
