"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Only check the server on focus if X minutes have passed since the last check
const THROTTLE_INTERVAL = 1000 * 60 * 10; // 10 minutes

export function useAuthSync(user) {
  const router = useRouter();
  const lastCheckedRef = useRef(Date.now());

  useEffect(() => {
    const localUserId = user?.id;
    if (!localUserId) return;

    // 1. Initialize Modern Cross-Tab communication channel
    const authChannel = new BroadcastChannel("auth_session_sync");

    const handleCrossTabMessage = async (event) => {
      const { action, userId } = event.data;

      if (action === "LOGOUT") {
        // Another tab logged out, immediately clean up and redirect
        router.push("/login");
        router.refresh();
      } else if (action === "LOGIN" && userId !== localUserId) {
        // Another tab logged in as a different user (Imposter caught)
        await fetch("/api/logout", { method: "POST" });
        router.push("/login");
      }
    };

    authChannel.addEventListener("message", handleCrossTabMessage);

    // 2. Throttled server fallback (Handles absolute session expiration or logouts on other devices)
    const checkSessionFromServer = async () => {
      const now = Date.now();
      if (now - lastCheckedRef.current < THROTTLE_INTERVAL) return; // Skip if checked recently

      lastCheckedRef.current = now;

      try {
        const response = await fetch("/api/check-session");
        const data = await response.json();

        if (data.loggedIn === false) {
          router.push("/login");
          router.refresh();
        } else if (data.loggedIn === true && data.userId !== localUserId) {
          await fetch("/api/logout", { method: "POST" });
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking session status:", error);
      }
    };

    window.addEventListener("focus", checkSessionFromServer);

    // Cleanup listeners on unmount
    return () => {
      authChannel.removeEventListener("message", handleCrossTabMessage);
      authChannel.close();
      window.removeEventListener("focus", checkSessionFromServer);
    };
  }, [user, router]);
}
