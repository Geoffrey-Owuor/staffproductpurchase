"use client";

import { createContext, useContext, useState } from "react";

const LayoutContext = createContext(null);

export const LayoutProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTopbar, setShowTopbar] = useState(false);

  const leftMargin = showTopbar
    ? "left-0"
    : sidebarOpen
      ? "left-58"
      : "left-14";

  const values = {
    sidebarOpen,
    setSidebarOpen,
    showTopbar,
    setShowTopbar,
    leftMargin,
  };
  return (
    <LayoutContext.Provider value={values}>{children}</LayoutContext.Provider>
  );
};

// Create a custom hook to use the context
export const useLayout = () => {
  const context = useContext(LayoutContext);

  if (!context)
    throw new Error("useLayout must be used within a Layout Provider ");

  return context;
};
