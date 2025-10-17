"use client";
import ThemeToggle from "./ThemeProviders/ThemeToggle";
import { BrainCog } from "lucide-react";

export default function DashboardFooter({ isSidebarOpen }) {
  return (
    <footer
      className={`relative bg-white transition-all duration-200 dark:bg-gray-950 ${isSidebarOpen ? "ml-56" : "mr-4 ml-20"}`}
    >
      <div className="mx-auto max-w-4xl py-5 text-center">
        <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <span>
            © {new Date().getFullYear()} Hotpoint Appliances Ltd. Built by
          </span>
          <span className="font-semibold">Jeff</span>
          <BrainCog className="h-3.5 w-3.5" />
        </div>
      </div>
      {/* ThemeToggle */}
      <div className="absolute right-5.5 bottom-2.5 z-50">
        <ThemeToggle />
      </div>
    </footer>
  );
}
