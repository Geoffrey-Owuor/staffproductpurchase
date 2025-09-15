"use client";

import { useState, useEffect, useRef } from "react";
import { UserRound, ChevronDown } from "lucide-react";

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const roleDisplayMap = {
    hr: "HR & Admin",
    cc: "Credit Control",
    bi: "Billing & Invoice",
    staff: "Staff",
  };

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/current-user");
        const data = await res.json();
        if (data) setUser(data); // Expected: { name, email, role }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-gray-900 transition hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
      >
        <UserRound className="h-5 w-5" />
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {/* Dropdown */}
      {isOpen && user && (
        <div className="absolute z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-950">
          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {roleDisplayMap[user.role] ||
                user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </div>
          <div className="p-2">
            <a
              href="mailto:helpdesk@hotpoint.co.ke"
              className="block w-full rounded-md px-3 py-2 text-left text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800"
            >
              Help & Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
