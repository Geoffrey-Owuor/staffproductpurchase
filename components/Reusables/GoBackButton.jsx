"use client";
import { ArrowLeft } from "lucide-react";

export default function GoBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </button>
  );
}
