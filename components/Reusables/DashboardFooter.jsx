"use client";
import ThemeToggle from "./ThemeProviders/ThemeToggle";

export default function DashboardFooter() {
  return (
    <footer className="relative">
      <div className="mx-auto max-w-4xl py-5 text-center">
        <div className="flex items-center justify-center space-x-1 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Hotpoint Appliances Ltd.
          </span>
        </div>
      </div>
      {/* ThemeToggle */}
      <div className="absolute right-4 bottom-3.5 hidden md:block">
        <ThemeToggle />
      </div>
    </footer>
  );
}
