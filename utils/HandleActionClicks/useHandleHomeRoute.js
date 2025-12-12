"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export function UseHandleHomeRoute() {
  const { role: userRole } = useUser();
  const router = useRouter();
  let homePath;

  switch (userRole) {
    case "payroll":
      homePath = `/payrolldashboard`;
      break;
    case "hr":
      homePath = `/hrdashboard`;
      break;
    case "cc":
      homePath = `/ccdashboard`;
      break;
    case "bi":
      homePath = `/bidashboard`;
      break;
    case "staff":
      homePath = `/staffdashboard`;
      break;
    default:
      homePath = "/login";
      break;
  }

  function handleHomeRoute() {
    router.push(homePath);
  }

  return { handleHomeRoute, homePath };
}
