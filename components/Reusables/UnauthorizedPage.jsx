"use client";

import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-50 p-4">
            <AlertTriangle
              className="h-12 w-12 text-red-500"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-800">
          Unauthorized Access
        </h1>
        <p className="mb-6 text-gray-600">
          You don't have permission to access this page. Please contact the
          administrator if you believe this is an error.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoBack}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-800 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back to Previous Page
          </button>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Return to Homepage
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Need help? Contact our support team</p>
        <a
          href="mailto:helpdesk@hotpoint.co.ke"
          className="text-blue-600 hover:underline"
        >
          helpdesk@hotpoint.co.ke
        </a>
      </div>
    </div>
  );
}
