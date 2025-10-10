"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export function UseHandleHistoryRoute() {
  const { role: userRole } = useUser();
  const router = useRouter();

  return function handleHistoryRoute() {
    let dashboardPath;

    switch (userRole) {
      case "hr":
        dashboardPath = `/hrdashboard/requests-history`;
        break;
      case "cc":
        dashboardPath = `/ccdashboard/purchases-history`;
        break;
      case "bi":
        dashboardPath = `/bidashboard/purchases-history`;
        break;
      case "staff":
        dashboardPath = `/staffdashboard/purchase-history`;
        break;
      default:
        dashboardPath = "/login";
        break;
    }

    router.push(dashboardPath);
  };
}
