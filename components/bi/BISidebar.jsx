"use client";

import {
  FileBarChart,
  HomeIcon,
  LogOutIcon,
  ShoppingBagIcon,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function BISidebar({ isOpen }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const pathname = usePathname();
  const isActive = (href) => {
    if (href === "/bidashboard") {
      return pathname === href
        ? "bg-red-700 font-semibold"
        : "hover:text-gray-200";
    }
    return pathname.startsWith(href)
      ? "bg-red-700 font-semibold"
      : "hover:text-gray-200";
  };

  return (
    <div
      className={`fixed top-0 left-0 flex h-full w-56 flex-col bg-red-900 text-white ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Section */}
      <div className="mt-1.5 flex items-center pb-5.5 pl-5 text-3xl font-bold">
        <ShoppingBagIcon className="h-8 w-8 text-white" />
        <span className="text-white">Hotpoint</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow px-4 pt-0">
        <ul className="space-y-2">
          <li>
            <Link
              href="/bidashboard"
              className={`flex items-center gap-2 rounded-xl p-3 transition-colors ${isActive(
                "/bidashboard",
              )}`}
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/bidashboard/purchases-history"
              className={`flex items-center gap-2 rounded-xl p-3 transition-colors ${isActive(
                "/bidashboard/purchases-history",
              )}`}
            >
              <FileBarChart className="h-4 w-4" />
              Purchases History
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button at Bottom */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full cursor-pointer items-center gap-2 rounded-xl p-3 text-white transition-colors hover:bg-red-700"
        >
          {loggingOut ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Logging Out...
            </>
          ) : (
            <>
              <LogOutIcon className="h-4 w-4" />
              Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
}
