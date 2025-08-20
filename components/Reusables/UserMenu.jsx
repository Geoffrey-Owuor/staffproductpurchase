"use client";

import { useState, useEffect, useRef } from "react";
import { User, ChevronDown } from "lucide-react";

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
        className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-2 text-black transition hover:bg-red-200"
      >
        <User className="h-5 w-5" />
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && user && (
        <div className="animate-dropdown absolute right-0 left-1 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-400">
              {roleDisplayMap[user.role] ||
                user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </div>
          <div className="p-2">
            <a
              href="mailto:helpdesk@hotpoint.co.ke"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50"
            >
              Help & Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
