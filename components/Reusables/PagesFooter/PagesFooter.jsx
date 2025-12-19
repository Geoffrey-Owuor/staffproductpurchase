import ThemeToggle from "../ThemeProviders/ThemeToggle";
import { BrainCog } from "lucide-react";

const PagesFooter = () => {
  return (
    <div className="relative px-10 py-14 dark:border-gray-800">
      {/* Centered Part */}
      <div className="absolute inset-0 top-0 flex items-center justify-center space-x-1 text-sm md:top-7">
        <span className="text-gray-500 dark:text-gray-400">
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

      {/* ThemeToggle pinned right */}
      <div className="absolute top-18 right-4 hidden -translate-y-1/2 sm:block">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default PagesFooter;
