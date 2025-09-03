// hooks/useFinishLoading.js
"use client";

import { useEffect } from "react";

export function useFinishLoading(
  isLoading,
  setIsLoading,
  dependency,
  delay = 400,
) {
  useEffect(() => {
    if (!isLoading) return;

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, [dependency, isLoading, setIsLoading, delay]);
}
