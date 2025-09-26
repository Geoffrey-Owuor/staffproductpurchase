"use client";
import { useEffect, useState } from "react";
import { ShoppingBag, BrainCog } from "lucide-react";

export const FirstLoader = () => {
  const [logoVisible, setLogoVisible] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    //Trigger logo fade in
    const fadeTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 100);

    // Hide entire loader after 2 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Don't render anything after 2 seconds
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-9999 flex h-screen flex-col justify-between bg-white dark:bg-gray-950">
      {/* Empty space at the top (optional padding) */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className={`transition-opacity duration-[1500ms] ${
            logoVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <ShoppingBag className="animate-pulse-slow h-30 w-30 text-gray-900 dark:text-white" />
        </div>
      </div>

      {/* Footer at the bottom */}
      <div className="flex items-center justify-center space-x-1 p-5 text-sm text-gray-500 dark:text-gray-400">
        <span>
          © {new Date().getFullYear()} Hotpoint Appliances Ltd. Built by
        </span>
        <span className="font-semibold">Jeff</span>

        <BrainCog className="h-3.5 w-3.5" />
      </div>
    </div>
  );
};
