export const LoadingBar = ({ isLoading }) => {
  // if (!isLoading) return null;

  // return (
  //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-xs dark:bg-gray-950/30">
  //     <div className="flex space-x-3">
  //       <span className="dot gradient-dot bg-gray-gradient dark:bg-blue-gradient animate-custom-bounce animation-delay-0" />
  //       <span className="dot gradient-dot bg-gray-gradient dark:bg-blue-gradient animate-custom-bounce animation-delay-150" />
  //       <span className="dot gradient-dot bg-gray-gradient dark:bg-blue-gradient animate-custom-bounce animation-delay-300" />
  //     </div>
  //   </div>
  // );

  if (!isLoading) return null;

  return (
    // This main div provides the full-screen semi-transparent overlay
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-white/50 dark:bg-gray-950/50">
      {/* Container to align the spinner and text horizontally */}
      <div className="flex items-center space-x-2">
        {/* The Tailwind CSS spinner */}
        <div
          className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-gray-900 border-t-transparent dark:border-white dark:border-t-transparent"
          role="status"
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
  if (!isLoading) return null;

  return (
    // This main div provides the full-screen semi-transparent overlay
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-white/50 dark:bg-gray-950/50">
      {/* Container to align the spinner and text horizontally */}
      <div className="flex items-center space-x-2">
        {/* The Tailwind CSS spinner */}
        <div
          className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-gray-900 border-t-transparent dark:border-white dark:border-t-transparent"
          role="status"
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
        {/* The Tailwind CSS spinner */}
        <div
          className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-gray-900 border-t-transparent dark:border-white dark:border-t-transparent"
          role="status"
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
