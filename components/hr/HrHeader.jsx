"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { User, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

const HrHeader = ({ isSidebarOpen, toggleSidebar }) => {
  const router = useRouter();
  const [userName, setUserName] = useState("User"); // Default to "User"
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/current-user");
        const data = await response.json();
        if (data?.name) setUserName(data.name);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    fetchUser();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
  return (
    <header
      className={`fixed top-0 right-0 z-50 flex h-14 items-center pr-4 pl-2 ${
        isSidebarOpen ? "left-56" : "left-0"
      } ${isScrolled ? "border-b border-gray-200 bg-white shadow-md" : "bg-white"}`}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="mr-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-200 hover:bg-red-300"
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>

      {/* Left side - Greeting */}
      <div className="flex items-center rounded-full bg-slate-800 px-3 py-2 text-white">
        <User className="mr-2 h-5 w-5" />
        <span className="text-sm font-medium">Hello, {userName}</span>
      </div>

      {/* Right side - Actions */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Logout Button */}
        <button
          className="flex cursor-pointer items-center rounded-full bg-red-100 px-3 py-2 transition-colors hover:bg-red-200"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <>
              <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-black border-t-transparent"></div>
              <span className="text-sm">Logging Out...</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm">Logout</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default HrHeader;
