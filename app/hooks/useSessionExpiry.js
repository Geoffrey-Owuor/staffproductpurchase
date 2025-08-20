"use client";
import { useEffect, useState } from "react";

export function useSessionExpiry(expiresAt) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const now = Date.now();
    const msUntilExpiry = expiresAt - now;

    // Helper to handle expiry actions
    const handleExpiry = () => {
      // Delete cookie immediately
      document.cookie = "session_token=; path=/; max-age=0";
      setExpired(true);
    };

    if (msUntilExpiry <= 0) {
      handleExpiry();
      return;
    }

    const timeout = setTimeout(handleExpiry, msUntilExpiry);

    return () => clearTimeout(timeout);
  }, [expiresAt]);

  return expired;
}
