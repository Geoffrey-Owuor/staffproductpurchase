"use client";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export function useHandleHrefLink() {
  const { role: userRole } = useUser();
  const router = useRouter();

  return function handleHrefLink(id) {
    let dashboardPath;

    switch (userRole) {
      case "payroll":
        dashboardPath = `/payrolldashboard/purchases-history/purchases/${id}`;
        break;
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
