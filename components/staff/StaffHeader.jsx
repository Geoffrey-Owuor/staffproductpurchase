"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserMenu from "../Reusables/UserMenu";
import LoadingLine from "../Reusables/LoadingLine";
import { useFinishLoading } from "@/app/hooks/useFinishLoading";

import { LogOut, PlusCircle, ChevronLeft, Menu } from "lucide-react";
import HotpointLogo from "../Reusables/HotpointLogo";

const Header = ({ toggleSidebar }) => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLinkClick = (path) => {
    setIsLoading(true);
    router.push(path);
  };

  useFinishLoading(isLoading, setIsLoading, router);

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 flex h-14 items-center border-b border-gray-200 bg-white pr-4 pl-2 transition-all duration-200`}
      >
        {/* Hotpoint Logo */}
        <HotpointLogo />

        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="mr-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* User Information */}
        <UserMenu />

        {/* Right side - Actions */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Go back Button */}
          <button
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {/* New Purchase Link */}
          <button
            onClick={() => handleLinkClick("/staffdashboard/new-purchase")}
            className={`flex items-center rounded-full bg-red-50 px-3 py-2 transition-colors hover:bg-red-100`}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="text-sm">New Purchase</span>
          </button>

          {/* Logout Button */}
          <button
            className="flex items-center rounded-full border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-100"
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
      <LoadingLine isLoading={isLoading} />
    </>
  );
};

export default Header;
