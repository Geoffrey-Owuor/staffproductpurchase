"use client";
import { Undo2 } from "lucide-react";

export default function GoBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center justify-center gap-2 rounded-full border border-red-300 px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
    >
      <Undo2 className="h-4 w-4" />
      Go Back
    </button>
  );
}
