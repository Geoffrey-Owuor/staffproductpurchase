"use client";

import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthPagesLogo } from "@/public/assets";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="absolute top-3.5 left-4 z-50">
        <AuthPagesLogo />
      </div>
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-300 bg-gray-100 p-8 text-center dark:border-gray-600 dark:bg-gray-900">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-yellow-100 p-4 dark:bg-yellow-900">
            <AlertTriangle
              className="h-12 w-12 text-yellow-600 dark:text-white"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Unauthorized Access
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          You don&apos;t have permission to access this page. Please contact the
          administrator if you believe this is an error.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoBack}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-200 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back to Previous Page
          </button>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Return to Homepage
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Need help? Contact our support team</p>
        <a
          href="mailto:helpdesk@hotpoint.co.ke"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          helpdesk@hotpoint.co.ke
        </a>
      </div>
    </div>
  );
}
