import { useState, useEffect } from "react";
import { assets } from "@/public/assets";
import { useTheme } from "next-themes";
import ThemeToggle from "../ThemeProviders/ThemeToggle";
import { AuthPagesLogo } from "@/public/assets";
import { BrainCog } from "lucide-react";

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
      <div className="w-[350px] pb-8 md:w-[400px]">{children}</div>

      {/* Footer text */}
      <div className="absolute bottom-2">
        <div className="flex items-center justify-center space-x-1 text-sm">
          <span className="text-gray-700 dark:text-gray-400">
            © {new Date().getFullYear()} Hotpoint Appliances Ltd. Built by
          </span>
          <a
            href="https://jeff-portfolio-web.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-500 hover:text-gray-600 hover:underline dark:hover:text-gray-400"
          >
            <span className="font-semibold">Jeff</span>
            <BrainCog className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Theme Toggle - Bottom Right */}
      <div className="absolute right-4 bottom-2 z-50 hidden sm:block">
        <ThemeToggle />
      </div>
    </div>
  );
}
