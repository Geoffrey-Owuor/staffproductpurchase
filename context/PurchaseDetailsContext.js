"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const PurchaseDetailsContext = createContext();

export const usePurchase = () => useContext(PurchaseDetailsContext);

export const PurchaseProvider = ({ id, children }) => {
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placing the fetching in a useCallback
  const fetchPurchaseDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/generalviewpurchases/${id}`);
      if (!res.ok) throw new Error("Failed to fetch purchase");
      const data = await res.json();
      setPurchase(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]); //Recreate function when id changes

  // First run on context mount
  useEffect(() => {
    fetchPurchaseDetails();
  }, [fetchPurchaseDetails]);

  // Refetch function for data refresh (not used for now)
  const refetchPurchaseDetails = useCallback(() => {
    fetchPurchaseDetails();
  }, [fetchPurchaseDetails]);

  const value = {
    purchase,
    setPurchase,
    refetchPurchaseDetails,
    loading,
    error,
  };

  return (
    <PurchaseDetailsContext.Provider value={value}>
      {children}
    </PurchaseDetailsContext.Provider>
  );
};
