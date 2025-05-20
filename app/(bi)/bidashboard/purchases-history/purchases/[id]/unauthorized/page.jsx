"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedEdit() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
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
          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            Edit Unauthorized
          </h2>
          <p className="mt-2 text-gray-600">
            This purchase request has been approved by Billing & Invoice and can
            no longer be modified.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/bidashboard")}
              className="inline-flex items-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
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
