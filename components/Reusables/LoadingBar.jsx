// export const LoadingBar = ({ isLoading }) => {
//   if (!isLoading) return null;

//   return (
//     <div className="fixed top-0 left-0 z-50 h-1 w-full overflow-hidden">
//       <div className="animate-red-gradient bg-red-gradient h-full w-full bg-[length:200%_100%]" />
//     </div>
//   );
// };

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
