"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export function UseHandleViewClick() {
  const { role: userRole } = useUser();
  const router = useRouter();

  return function handleViewClick(id) {
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

    router.push(dashboardPath);
  };
}
