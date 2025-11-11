"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Default fetch options
const DEFAULT_FETCH_OPTIONS = { filterType: "staff", searchTerm: "" };

const ApproversPurchaseContext = createContext(null);

export function ApproversPurchaseProvider({
  children,
  fetchAllData,
  biApproval,
}) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Main fetch function.
   * Can be called with specific options (for filtering)
   * or with no options (for a default fetch).
   */
  const fetchPurchases = useCallback(
    async (options) => {
      // Use provided options or fall back to default options
      const queryOptions = options || DEFAULT_FETCH_OPTIONS;

      setLoading(true);

      try {
        let url = `/api/tablesdata/purchaseshistorydata?filterType=${queryOptions.filterType || "staff"}`;

        //Telling the api if we should fetch all the data or if biApproval is true
        if (fetchAllData) {
          url += `&fetchAll=true`;
        }
        if (biApproval) {
          url += `&biApproval=true`;
        }

        //   Other filters
        if (queryOptions.filterType === "staff" && queryOptions.searchTerm) {
          url += `&search=${encodeURIComponent(queryOptions.searchTerm.trim())}`;
        } else if (
          queryOptions.filterType === "date" &&
          queryOptions.fromDate &&
          queryOptions.toDate
        ) {
          url += `&fromDate=${queryOptions.fromDate}&toDate=${queryOptions.toDate}`;
        } else if (
          queryOptions.filterType === "period" &&
          queryOptions.monthPeriod
        ) {
          url += `&monthPeriod=${queryOptions.monthPeriod}`;
        } else if (
          queryOptions.filterType === "terms" &&
          queryOptions.paymentTerms
        ) {
          url += `&paymentTerms=${queryOptions.paymentTerms}`;
        } else if (
          queryOptions.filterType === "payroll" &&
          queryOptions.payrollNumber
        ) {
          url += `&payrollNumber=${encodeURIComponent(queryOptions.payrollNumber.trim())}`;
        } else if (
          queryOptions.filterType === "reference" &&
          queryOptions.referenceNumber
        ) {
          url += `&referenceNumber=${encodeURIComponent(queryOptions.referenceNumber.trim())}`;
        } else if (
          queryOptions.filterType === "closure" &&
          queryOptions.requestClosure
        ) {
          url += `&requestClosure=${queryOptions.requestClosure}`;
        } else if (
          queryOptions.filterType === "approval" &&
          queryOptions.approvalStatus
        ) {
          url += `&approvalStatus=${queryOptions.approvalStatus}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch purchases");

        const data = await response.json();
        setPurchases(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching purchases:", error);
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchAllData, biApproval],
  );

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
    setPurchases,
    fetchPurchases, // For the filter form
    refetchDefaultPurchases, //for refetching default data
    fetchAllData, // Pass this down so the component can use it for the display logic
    biApproval,
  };

  return (
    <ApproversPurchaseContext.Provider value={value}>
      {children}
    </ApproversPurchaseContext.Provider>
  );
}

// Custom hook for easy access
export const useApproversPurchases = () => {
  const context = useContext(ApproversPurchaseContext);
  if (!context) {
    throw new Error(
      "useApproversPurchases must be used within an ApproversPurchaseProvider",
    );
  }
  return context;
};
