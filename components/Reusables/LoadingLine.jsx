"use client";
import { useEffect, useState } from "react";

export default function LoadingLine({ isLoading }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading) {
      setVisible(true);
      setProgress(0);

      // Simulate loading progress up to 95%
      timer = setInterval(() => {
        setProgress((old) => {
          if (old < 95) return old + 5;
          return old;
        });
      }, 50);
    } else {
      // Finish progress to 100%
      setProgress(100);

      // Then hide after animation completes
      const timeout = setTimeout(() => {
        setVisible(false);
        setProgress(0); // reset internally, but invisible
      }, 50);

      return () => clearTimeout(timeout);
    }

    return () => clearInterval(timer);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full">
      <div
        className="h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 transition-all duration-100"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
