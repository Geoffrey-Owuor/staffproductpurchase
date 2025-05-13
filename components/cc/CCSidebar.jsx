"use client";

import { assets } from "@/public/assets";
import { FileBarChart, HomeIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function CCSidebar({ isOpen }) {
  const router = useRouter();
  const handleLogout = async () => {
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
    if (href === "/ccdashboard") {
      return pathname === href
        ? "bg-red-700 font-semibold"
        : "hover:text-gray-300";
    }
    return pathname.startsWith(href)
      ? "bg-red-700 font-semibold"
      : "hover:text-gray-300";
  };

  return (
    <div
      className={`fixed top-0 left-0 flex h-full w-56 flex-col bg-red-900 text-white shadow-md ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Section */}
      <div className="ml-5.5">
        <Image
          src={assets.hotpoint_logo}
          alt="Logo"
          className="w-35"
          priority
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow px-4 pt-0">
        <ul className="space-y-2">
          <li>
            <Link
              href="/ccdashboard"
              className={`flex items-center gap-2 rounded-2xl p-3 transition-colors ${isActive(
                "/ccdashboard",
              )}`}
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/ccdashboard/purchases-history"
              className={`flex items-center gap-2 rounded-2xl p-3 transition-colors ${isActive(
                "/ccdashboard/purchases-history",
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
          className="flex w-full cursor-pointer items-center gap-2 rounded-2xl p-3 text-white transition-colors hover:bg-red-700"
        >
          <LogOutIcon className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
