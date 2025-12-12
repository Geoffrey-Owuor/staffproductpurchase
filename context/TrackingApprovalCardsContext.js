"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// Create the context
const TrackingApprovalCardsContext = createContext(null);

// Creating the provider
export function TrackingApprovalCardsProvider({ children }) {
  const [counts, setCounts] = useState({ open: 0, closed: 0, approved: 0 });
  const [loading, setLoading] = useState(true);

  //   Defining the fetching logic in a useCallBack

  const fetchApprovalCounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/closure-counts");
      if (!response.ok) throw new Error("Failed to fetch counts");

      const data = await response.json();
      setCounts({
        open: data.open || 0,
        closed: data.closed || 0,
        approved: data.approved || 0,
      });
    } catch (error) {
      console.error("Error fetching closure counts:", error);
    } finally {
      setLoading(false);
    }
  }, []); //Empty dependency array, function will be created once

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
    <TrackingApprovalCardsContext.Provider value={value}>
      {children}
    </TrackingApprovalCardsContext.Provider>
  );
}

//Creating a custom hook for easy access
export const useTrackingApprovalCards = () => {
  const context = useContext(TrackingApprovalCardsContext);

  if (!context) {
    throw new Error(
      "useTrackingApprovalCards must be used within an TrackingApprovalCardsProvider",
    );
  }

  return context;
};
