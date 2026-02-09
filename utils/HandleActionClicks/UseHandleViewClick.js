"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export function UseHandleViewClick() {
  const { role: userRole } = useUser();
  const router = useRouter();

  function handleViewClick(id) {
    let path;
    switch (userRole) {
      case "payroll":
        path = `/payrolldashboard/purchases-history/purchases/${id}`;
        break;
      case "hr":
        path = `/hrdashboard/requests-history/requests/${id}`;
        break;
      case "cc":
        path = `/ccdashboard/purchases-history/purchases/${id}`;
        break;
      case "bi":
        path = `/bidashboard/purchases-history/purchases/${id}`;
        break;
      default:
        path = "/login";
        break;
    }
    //navigate to path
    router.push(path);
  }

  const getViewPathName = (id) => {
    let path;
    switch (userRole) {
      case "payroll":
        path = `/payrolldashboard/purchases-history/purchases/${id}`;
        break;
      case "hr":
        path = `/hrdashboard/requests-history/requests/${id}`;
        break;
      case "cc":
        path = `/ccdashboard/purchases-history/purchases/${id}`;
        break;
      case "bi":
        path = `/bidashboard/purchases-history/purchases/${id}`;
        break;
      default:
        path = "/login";
        break;
    }

    // Return the path
    return path;
  };

  return { handleViewClick, getViewPathName };
}
