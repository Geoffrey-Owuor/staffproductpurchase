// app/not-found.js
import { Home, FileQuestion } from "lucide-react";
import GoBackButton from "@/components/Reusables/GoBackButton";
import { AuthPagesLogo } from "@/public/assets";

export const metadata = {
  title: "Page Not Found | Hotpoint Staff Portal",
  description:
    "The page you are looking for does not exist in the Hotpoint Appliances staff product purchase portal.",
  robots: "noindex, nofollow",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center dark:bg-gray-950">
      <div className="absolute top-3.5 left-4 z-50">
        <AuthPagesLogo />
      </div>
      <FileQuestion
        className="mb-4 h-16 w-16 text-gray-700 dark:text-gray-200"
        strokeWidth={1.5}
      />
      <h1 className="mb-2 text-3xl font-semibold text-gray-900 dark:text-gray-50">
        404 – Page Not Found
      </h1>
      <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
        It looks like the page you are looking for doesn’t exist or may have
        been moved.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <a
          href="/"
          className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
        >
          <Home className="h-4 w-4" />
          Go to Homepage
        </a>
        <GoBackButton />
      </div>

      <footer className="mt-10 text-sm text-gray-500 dark:text-gray-400">
        © Hotpoint Appliances Ltd. All rights reserved
      </footer>
    </div>
  );
}
