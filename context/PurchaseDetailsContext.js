"use client";
import { createContext, useContext, useState, useEffect } from "react";

const PurchaseDetailsContext = createContext();

export const usePurchase = () => useContext(PurchaseDetailsContext);

export const PurchaseProvider = ({ id, children }) => {
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPurchaseDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/generalviewpurchases/${id}`);
        if (!res.ok) throw new Error("Failed to fetch purchase");
        const data = await res.json();
        setPurchase(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [id]);

  const value = { purchase, loading, error };

  return (
    <PurchaseDetailsContext.Provider value={value}>
      {children}
    </PurchaseDetailsContext.Provider>
  );
};
