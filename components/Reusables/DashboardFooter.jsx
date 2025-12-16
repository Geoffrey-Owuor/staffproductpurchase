"use client";
import ThemeToggle from "./ThemeProviders/ThemeToggle";
import { BrainCog } from "lucide-react";

export default function DashboardFooter() {
  return (
    <footer className="relative">
      <div className="mx-auto max-w-4xl py-5 text-center">
        <div className="flex items-center justify-center space-x-1 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Hotpoint Appliances Ltd. Built by
          </span>
          <a
            href="https://jeff-portfolio-web.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-500 hover:text-gray-600 hover:underline dark:hover:text-gray-400"
          >
            <span className="font-semibold">Jeff</span>
            <BrainCog className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      {/* ThemeToggle */}
      <div className="absolute right-4 bottom-3.5 hidden md:block">
        <ThemeToggle />
      </div>
    </footer>
  );
}
