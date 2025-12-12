"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// The default options to fetch when the context loads or is reset
const DEFAULT_FETCH_OPTIONS = { filterType: "approval", approvalStatus: "" };

const StaffPurchaseContext = createContext(null);

export function StaffPurchaseProvider({ children, fetchAllData }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Main fetch function.
   * Can be called with specific options (for filtering)
   * or with no options (for a default fetch).
   */
  const fetchPurchases = useCallback(
    async (options) => {
      // Use provided options, or fall back to the default options
      const queryOptions = options || DEFAULT_FETCH_OPTIONS;

      setLoading(true);
      try {
        let url = `/api/staffpurchaseshistory?filterType=${queryOptions.filterType || "approval"}`;

        // Use the 'fetchAllData' prop passed to the Provider
        if (fetchAllData) {
          url += `&fetchAll=true`;
        }

        // Add filter params if they exist in the options
        if (
          queryOptions.filterType === "date" &&
          queryOptions.fromDate &&
          queryOptions.toDate
        ) {
          url += `&fromDate=${queryOptions.fromDate}&toDate=${queryOptions.toDate}`;
        } else if (
          queryOptions.filterType === "approval" &&
          queryOptions.approvalStatus
        ) {
          url += `&approvalStatus=${queryOptions.approvalStatus}`;
        } else if (
          queryOptions.filterType === "terms" &&
          queryOptions.paymentTerms
        ) {
          url += `&paymentTerms=${queryOptions.paymentTerms}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch purchases");

        const data = await response.json();
        setPurchases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching purchases:", err);
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchAllData],
  ); // Re-create this function if 'fetchAllData' prop changes

  // Initial fetch when the provider mounts
  useEffect(() => {
    fetchPurchases(DEFAULT_FETCH_OPTIONS);
  }, [fetchPurchases]); // Runs once on mount

  // Function exposed to OTHER components to trigger a simple, default refetch
  const refetchDefaultPurchases = useCallback(() => {
    fetchPurchases(DEFAULT_FETCH_OPTIONS);
  }, [fetchPurchases]);

  // Provide all state and functions to children
  const value = {
    purchases,
    loading,
    fetchPurchases, // For the filter form
    refetchDefaultPurchases,
    fetchAllData, // Pass this down so the component can use it for the display logic
  };

  return (
    <StaffPurchaseContext.Provider value={value}>
      {children}
    </StaffPurchaseContext.Provider>
  );
}

// Custom hook for easy access
export const useStaffPurchases = () => {
  const context = useContext(StaffPurchaseContext);
  if (!context) {
    throw new Error(
      "useStaffPurchases must be used within a StaffPurchaseProvider",
    );
  }
  return context;
};
