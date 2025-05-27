// app/not-found.js
import GoBackButton from "@/components/Reusables/GoBackButton";
import { AlertTriangle, Home } from "lucide-react";

// Add metadata export
export const metadata = {
  title: "Page Not Found | Hotpoint Staff Portal",
  description:
    "The page you are looking for does not exist in the Hotpoint Appliances staff product purchase portal.",
  robots: "noindex, nofollow", // Prevent search indexing
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-red-100 bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 bg-red-600 p-6">
          <AlertTriangle className="h-10 w-10 text-white" strokeWidth={2} />
          <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 blur-lg"></div>
              <AlertTriangle
                className="relative h-20 w-20 text-red-600"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            404 Error
          </h2>
          <p className="mb-6 text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              <Home className="h-4 w-4" />
              Return to homepage
            </a>
            <GoBackButton />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-red-50 p-4 text-center text-sm text-red-800">
          © Hotpoint Appliances Ltd. All rights reserved
        </div>
      </div>
    </div>
  );
}
