"use client";

import { useState, useContext, createContext, useCallback } from "react";

const LoadingLineContext = createContext(null);

export const LoadingLineProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  const value = {
    isLoading,
    startLoading,
    stopLoading,
  };

  return (
    <LoadingLineContext.Provider value={value}>
      {children}
    </LoadingLineContext.Provider>
  );
};

// Custom hook to use the context
export const useLoadingLine = () => {
  const context = useContext(LoadingLineContext);

  if (!context)
    throw new Error("useLoading must be used within a Loading Provider");

  return context;
};
