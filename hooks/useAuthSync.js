"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useAuthSync(user) {
  const router = useRouter();
  const lastCheckedRef = useRef(null);

  useEffect(() => {
    const localUserId = user?.id;
    if (!localUserId) return;

    // Set the initial timestamp when the component mounts/user changes
    if (lastCheckedRef.current === null) {
      lastCheckedRef.current = Date.now();
    }

    // 1. Initialize Modern Cross-Tab communication channel
    const authChannel = new BroadcastChannel("auth_session_sync");

    const handleCrossTabMessage = async (event) => {
      const { action, userId } = event.data;

      if (action === "LOGOUT") {
        window.location.href = "/login";
      } else if (action === "LOGIN" && userId !== localUserId) {
        // Another tab logged in as a different user - reload the tab
        window.location.reload();
      }
    };

    authChannel.addEventListener("message", handleCrossTabMessage);

    // Cleanup listeners on unmount
    return () => {
      authChannel.removeEventListener("message", handleCrossTabMessage);
      authChannel.close();
    };
  }, [user, router]);
}
