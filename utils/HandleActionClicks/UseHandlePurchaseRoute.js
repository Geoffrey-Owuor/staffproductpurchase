"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export function UseHandlePurchaseRoute() {
  const { role: userRole } = useUser();
  const router = useRouter();

  let purchasePath;

  switch (userRole) {
    case "payroll":
      purchasePath = `/payrolldashboard/new-purchase`;
      break;
    case "hr":
      purchasePath = `/hrdashboard/new-purchase`;
      break;
    case "cc":
      purchasePath = `/ccdashboard/new-purchase`;
      break;
    case "bi":
      purchasePath = `/bidashboard/new-purchase`;
      break;
    case "staff":
      purchasePath = `/staffdashboard/new-purchase`;
      break;
    default:
      purchasePath = "/login";
      break;
  }

  function handlePurchaseRoute() {
    router.push(purchasePath);
  }

  return { handlePurchaseRoute, purchasePath };
}
