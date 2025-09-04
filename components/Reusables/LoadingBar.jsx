export const LoadingBar = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex space-x-3">
        <span className="dot gradient-dot animate-custom-bounce animation-delay-0" />
        <span className="dot gradient-dot animate-custom-bounce animation-delay-150" />
        <span className="dot gradient-dot animate-custom-bounce animation-delay-300" />
      </div>
    </div>
  );
};

export const LoadingBarWave = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-black/50">
      <div className="flex space-x-3">
        <span className="wave-dot wave-delay-0" />
        <span className="wave-dot wave-delay-150" />
        <span className="wave-dot wave-delay-300" />
      </div>
    </div>
  );
};
