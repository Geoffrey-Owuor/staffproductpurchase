import ThemeToggle from "../ThemeProviders/ThemeToggle";
import { AuthPagesLogo } from "@/public/assets";
import { BrainCog } from "lucide-react";

export default function AuthBackground({ children }) {
  return (
    <div className="auth-background relative flex min-h-screen flex-col items-center justify-center bg-center text-gray-900 dark:text-white">
      {/* Company Logo */}
      <div className="custom:left-10 fixed top-3.5 left-4 z-50">
        <AuthPagesLogo />
      </div>

      {/* Page-specific content (e.g., Login card, Register card) */}
      <div className="w-[350px] pb-8 md:w-[400px]">{children}</div>

      {/* Footer text */}
      <div className="absolute bottom-4">
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
      <div className="custom:right-10 absolute right-4 bottom-2 z-50 hidden sm:block">
        <ThemeToggle />
      </div>
    </div>
  );
}
