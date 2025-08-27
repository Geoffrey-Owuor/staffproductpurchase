"use client";
import {
  HomeIcon,
  LogOutIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen }) {
  const [loggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const isActive = (href) => {
    const active =
      href === "/staffdashboard"
        ? pathname === href
        : pathname.startsWith(href);

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
              href="/staffdashboard"
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${isActive(
                "/staffdashboard",
              )}`}
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/staffdashboard/new-purchase"
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${isActive(
                "/staffdashboard/new-purchase",
              )}`}
            >
              <ShoppingBagIcon className="h-4 w-4" />
              New Purchase
            </Link>
          </li>
          <li>
            <Link
              href="/staffdashboard/purchase-history"
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${isActive(
                "/staffdashboard/purchase-history",
              )}`}
            >
              <ShoppingCartIcon className="h-4 w-4" />
              Purchase History
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
