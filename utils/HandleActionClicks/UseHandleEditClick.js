"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export function UseHandleEditClick() {
  const { role: userRole } = useUser();
  const router = useRouter();

  return function handleEditClick(id) {
    let dashboardPath;

    switch (userRole) {
      case "payroll":
        dashboardPath = `/payrolldashboard/purchases-history/purchases/${id}/edit`;
        break;
      case "hr":
        dashboardPath = `/hrdashboard/requests-history/requests/${id}/edit`;
        break;
      case "cc":
        dashboardPath = `/ccdashboard/purchases-history/purchases/${id}/edit`;
        break;
      case "bi":
        dashboardPath = `/bidashboard/purchases-history/purchases/${id}/edit`;
        break;
      default:
        dashboardPath = "/login";
        break;
    }

    router.push(dashboardPath);
  };
}
