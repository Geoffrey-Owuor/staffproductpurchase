import { useState, useEffect } from "react";
import { assets } from "@/public/assets";
import { useTheme } from "next-themes";
import ThemeToggle from "../ThemeProviders/ThemeToggle";
import { AuthPagesLogo } from "@/public/assets";

export default function AuthBackground({ children }) {
  // Dark mode backgrounds
  const lightModeBg = assets.light_mode_bg;
  const darkModeBg = assets.dark_mode_bg;

  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  //Determine the current theme and image to use for the background
  const currentTheme = theme === "system" ? systemTheme : theme;
  const backgroundImageUrl =
    currentTheme === "dark" ? darkModeBg.src : lightModeBg.src;

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-center text-gray-900 dark:text-white"
      style={{
        backgroundImage: ` linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${backgroundImageUrl})`,
      }}
    >
      {/* Company Logo */}
      <div className="fixed top-3.5 left-4 z-50">
        <AuthPagesLogo />
      </div>

      {/* Page-specific content (e.g., Login card, Register card) */}
      <div className="w-[350px] md:w-[400px]">{children}</div>

      {/* Theme Toggle - Bottom Right */}
      <div className="fixed right-4 bottom-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
