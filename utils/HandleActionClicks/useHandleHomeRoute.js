"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export function UseHandleHomeRoute() {
  const { role: userRole } = useUser();
  const router = useRouter();

  return function handleHomeRoute() {
    let dashboardPath;

    switch (userRole) {
      case "payroll":
        dashboardPath = `/payrolldashboard`;
        break;
      case "hr":
        dashboardPath = `/hrdashboard`;
        break;
      case "cc":
        dashboardPath = `/ccdashboard`;
        break;
      case "bi":
        dashboardPath = `/bidashboard`;
        break;
      case "staff":
        dashboardPath = `/staffdashboard`;
        break;
      default:
        dashboardPath = "/login";
        break;
    }

    router.push(dashboardPath);
  };
}
