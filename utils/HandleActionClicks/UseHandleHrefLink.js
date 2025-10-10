"use client";
import { useUser } from "@/context/UserContext";

export function useHandleHrefLink() {
  const { role: userRole } = useUser();

  return function handleHrefLink(id) {
    let dashboardPath;

    switch (userRole) {
      case "hr":
        dashboardPath = `/hrdashboard/requests-history/requests/${id}`;
        break;
      case "cc":
        dashboardPath = `/ccdashboard/purchases-history/purchases/${id}`;
        break;
      case "bi":
        dashboardPath = `/bidashboard/purchases-history/purchases/${id}`;
        break;
      default:
        dashboardPath = "/login";
        break;
    }

    window.location.href = dashboardPath;
  };
}
