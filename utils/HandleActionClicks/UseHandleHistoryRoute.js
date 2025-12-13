"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export function UseHandleHistoryRoute() {
  const { role: userRole } = useUser();
  const router = useRouter();

  let historyPath;

  switch (userRole) {
    case "payroll":
      historyPath = `/payrolldashboard/purchases-history`;
      break;
    case "hr":
      historyPath = `/hrdashboard/requests-history`;
      break;
    case "cc":
      historyPath = `/ccdashboard/purchases-history`;
      break;
    case "bi":
      historyPath = `/bidashboard/purchases-history`;
      break;
    case "staff":
      historyPath = `/staffdashboard/purchase-history`;
      break;
    default:
      historyPath = "/login";
      break;
  }

  function handleHistoryRoute() {
    router.push(historyPath);
  }

  return { handleHistoryRoute, historyPath };
}
