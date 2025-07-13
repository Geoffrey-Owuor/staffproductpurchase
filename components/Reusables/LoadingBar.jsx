// import { useState, useEffect } from "react";

// export const LoadingBar = ({ isLoading }) => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     if (!isLoading) {
//       setProgress(0);
//       return;
//     }

//     const interval = setInterval(() => {
//       setProgress((prev) => (prev >= 95 ? 95 : prev + 5));
//     }, 100);

//     return () => clearInterval(interval);
//   }, [isLoading]);

//   if (!isLoading && progress === 0) return null;

//   return (
//     <div
//       className="fixed top-0 left-0 z-50 h-1 w-full bg-red-500 transition-all duration-300 ease-in-out"
//       style={{ width: `${progress}%` }}
//     />
//   );
// };

export const LoadingBar = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full overflow-hidden">
      <div className="animate-red-gradient bg-red-gradient h-full w-full bg-[length:200%_100%]" />
    </div>
  );
};
