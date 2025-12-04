"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Create the context
const ApprovalCountsContext = createContext(null);

//Create the Provider
export function ApprovalCountsProvider({ children }) {
  const [counts, setCounts] = useState({
    pending: 0,
    declined: 0,
    approved: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  // Define the fetching logic in a useCallback then we call the useCallback function

  const fetchApprovalCounts = useCallback(async () => {
    setLoading(true); //set loading to true on every fetch
    try {
      const response = await fetch("/api/approval-counts");
      if (!response.ok) throw new Error("Failed to fetch approval counts");

      const data = await response.json();
      setCounts({
        pending: data.pending || 0,
        declined: data.declined || 0,
        approved: data.approved || 0,
        total: data.total || 0,
      });
    } catch (error) {
      console.error("Error fetching approval counts:", error);
    } finally {
      setLoading(false);
    }
  }, []); //Empty dependency array, this function will be created once

  //Fetch approval counts when provider first loads
  useEffect(() => {
    fetchApprovalCounts();
  }, [fetchApprovalCounts]);

  //   Provide the states and refresh function to children
  const value = {
    counts,
    loading,
    refetchCounts: fetchApprovalCounts, //exposing the fetch function
  };

  return (
    <ApprovalCountsContext.Provider value={value}>
      {children}
    </ApprovalCountsContext.Provider>
  );
}

//Creating a custom hook for easy access
export const useApprovalCounts = () => {
  const context = useContext(ApprovalCountsContext);

  if (!context) {
    throw new Error(
      "useApprovalCounts must be used within an ApprovalCountsProvider",
    );
  }
  return context;
};
