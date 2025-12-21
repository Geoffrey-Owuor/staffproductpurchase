"use client";
import { Loader } from "lucide-react";
import { useLayout } from "@/context/LayoutContext";

export const LoadingBar = ({ isLoading }) => {
  const { leftMargin } = useLayout();
  if (!isLoading) return null;

  return (
    // This main div provides the full-screen semi-transparent overlay
    <div
      className={`fixed inset-0 z-9999 ${leftMargin} flex h-screen items-center justify-center bg-white/50 transition-all duration-200 dark:bg-black/60`}
    >
      {/* Container to align the spinner and text horizontally */}
      <div className="flex items-center space-x-2">
        {/* The Lucide Loader spinner */}
        <Loader
          className="h-7 w-7 animate-spin text-gray-900 dark:text-white"
          aria-label="loading"
        />

        {/* The text, styled for dark and light modes */}
        <span className="text-lg text-gray-900 dark:text-white">
          Loading...
        </span>
      </div>
    </div>
  );
};

export const LoadingBarWave = ({ isLoading }) => {
  const { leftMargin } = useLayout();
  if (!isLoading) return null;

  return (
    // This main div provides the full-screen semi-transparent overlay
    <div
      className={`fixed inset-0 ${leftMargin} z-9999 flex h-screen items-center justify-center bg-white/50 transition-all duration-200 dark:bg-black/60`}
    >
      {/* Container to align the spinner and text horizontally */}
      <div className="flex items-center space-x-2">
        {/* The Lucide Loader spinner */}
        <Loader
          className="h-7 w-7 animate-spin text-gray-900 dark:text-white"
          aria-label="loading"
        />

        {/* The text, styled for dark and light modes */}
        <span className="text-lg text-gray-900 dark:text-white">Saving...</span>
      </div>
    </div>
  );
};

export const LoggingOutOverlay = ({ isLoggingOut }) => {
  if (!isLoggingOut) return null;

  return (
    // This main div provides the full-screen semi-transparent overlay
    <div className="fixed inset-0 z-9999 flex h-screen items-center justify-center bg-white dark:bg-gray-950">
      {/* Container to align the spinner and text horizontally */}
      <div className="flex items-center space-x-2">
        {/* The Lucide Loader spinner */}
        <Loader
          className="h-7 w-7 animate-spin text-gray-900 dark:text-white"
          aria-label="loading"
        />

        {/* The text, styled for dark and light modes */}
        <span className="text-lg text-gray-900 dark:text-white">
          Logging out...
        </span>
      </div>
    </div>
  );
};

export const DeletingOverlay = () => {
  const { leftMargin } = useLayout();
  return (
    // This main div provides the full-screen semi-transparent overlay
    <div
      className={`fixed inset-0 z-9999 ${leftMargin} flex h-screen items-center justify-center bg-white/50 transition-all duration-200 dark:bg-black/60`}
    >
      {/* Container to align the spinner and text horizontally */}
      <div className="flex items-center space-x-2">
        {/* The Lucide Loader spinner */}
        <Loader
          className="h-7 w-7 animate-spin text-gray-900 dark:text-white"
          aria-label="loading"
        />

        {/* The text, styled for dark and light modes */}
        <span className="text-lg text-gray-900 dark:text-white">
          Deleting...
        </span>
      </div>
    </div>
  );
};
