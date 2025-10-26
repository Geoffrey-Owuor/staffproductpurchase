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
      // Delete cookie immediately - THIS DOES NOT NECESSARILY WORK SINCE WE CAN NOT DIRECTLY MODIFY AN HTTP ONLY COOKIE USING document.cookie();
      document.cookie = "session_token=; path=/; max-age=0";
      setExpired(true);
    };

    //i
    if (msUntilExpiry <= 0) {
      handleExpiry();
      return;
    }

    const timeout = setTimeout(handleExpiry, msUntilExpiry);

    return () => clearTimeout(timeout);
  }, [expiresAt]);

  return expired;
}
