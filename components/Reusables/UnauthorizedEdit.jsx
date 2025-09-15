"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedEdit({ role }) {
  const router = useRouter();

  const dashBoardRoutes = {
    staff: "/staffdashboard",
    hr: "/hrdashboard",
    cc: "/ccdashboard",
    bi: "/bidashboard",
  };

  const handleRedirect = () => {
    const targetRoute = dashBoardRoutes[role] || "/";
    router.push(targetRoute);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Edit Unauthorized
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            This purchase request has been approved by Billing &amp; Invoice and
            can no longer be modified.
          </p>
          <div className="mt-6">
            <button
              onClick={handleRedirect}
              className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
