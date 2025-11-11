// hooks/useFinishLoading.js
"use client";

import { useEffect } from "react";

export function useFinishLoading(isLoading, setIsLoading, delay = 400) {
  useEffect(() => {
    if (!isLoading) return;

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isLoading, setIsLoading, delay]);
}
