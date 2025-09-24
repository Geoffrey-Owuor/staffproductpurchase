"use client";
import ThemeToggle from "./ThemeProviders/ThemeToggle";

export default function DashboardFooter({ isSidebarOpen }) {
  return (
    <footer
      className={`relative bg-white transition-all duration-200 dark:bg-gray-950 ${isSidebarOpen ? "ml-56" : "mr-10 ml-26"}`}
    >
      <div className="mx-auto max-w-4xl pt-3 pb-5 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Hotpoint Appliances Ltd. Crafted by Jeff
          👨‍💻
        </p>
      </div>
      {/* ThemeToggle */}
      <div className="absolute right-5.5 bottom-2.5 z-50">
        <ThemeToggle />
      </div>
    </footer>
  );
}
