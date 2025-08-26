"use client";

import { FileBarChart, HomeIcon, LogOutIcon } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function BISidebar({ isOpen }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();

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
      setLoggingOut(false);
    }
  };

  const isActive = (href) => {
    const active =
      href === "/bidashboard" ? pathname === href : pathname.startsWith(href);

    return active
      ? "bg-red-100 text-red-700 font-medium"
      : "text-gray-700 hover:bg-gray-100 hover:text-red-600";
  };

  return (
    <div
      className={`fixed top-20 bottom-0 left-0 flex w-56 flex-col bg-white transition-all duration-200 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Navigation Links */}
      <nav className="flex-grow px-3">
        <ul className="space-y-1">
          <li>
            <Link
              href="/bidashboard"
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${isActive(
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
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${isActive(
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
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-red-600"
        >
          {loggingOut ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
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
