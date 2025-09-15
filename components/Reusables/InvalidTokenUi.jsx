import { AuthPagesLogo } from "@/public/assets";
import ThemeToggle from "./ThemeProviders/ThemeToggle";
import Link from "next/link";

export default function InvalidTokenUi() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      {/* Logo */}
      <div className="absolute top-3.5 left-4 z-50">
        <AuthPagesLogo />
      </div>
      <div className="w-full max-w-[400px] px-8">
        <h1 className="mb-8 text-center text-3xl font-semibold">
          Invalid Token
        </h1>
        <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
          The password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="block w-full rounded-full bg-gray-900 p-3 text-center font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Request new reset link
        </Link>
        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-gray-700 hover:underline dark:text-gray-300 dark:hover:text-white"
          >
            Back to login
          </Link>
        </div>
      </div>
      {/* Theme Toggle - Bottom Right */}
      <div className="fixed right-4 bottom-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
