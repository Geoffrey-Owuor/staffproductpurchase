"use client";

import {
  HomeIcon,
  LogOutIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const pathname = usePathname();
  const isActive = (href) => {
    if (href === "/staffdashboard") {
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
              href="/staffdashboard"
              className={`flex items-center gap-2 rounded-xl p-3 transition-colors ${isActive(
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
              className={`flex items-center gap-2 rounded-xl p-3 transition-colors ${isActive(
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
              className={`flex items-center gap-2 rounded-xl p-3 transition-colors ${isActive(
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
