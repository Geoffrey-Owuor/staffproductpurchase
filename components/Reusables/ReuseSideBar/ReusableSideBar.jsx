"use client";
import { useEffect } from "react";
import { useLoadingLine } from "@/context/LoadingLineContext";
import { usePathname, useRouter } from "next/navigation";
import { UseHandleHomeRoute } from "@/utils/HandleActionClicks/UseHandleHomeRoute";
import { UseHandleHistoryRoute } from "@/utils/HandleActionClicks/UseHandleHistoryRoute";
import { UseHandlePurchaseRoute } from "@/utils/HandleActionClicks/UseHandlePurchaseRoute";
import { useUser } from "@/context/UserContext";
import LeftSidebar from "./LeftSidebar";
import TopSidebar from "./TopSidebar";
import { useLayout } from "@/context/LayoutContext";

export default function ReusableSidebar() {
  const { showTopbar } = useLayout();
  const { role } = useUser();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingLine();

  const { homePath, handleHomeRoute } = UseHandleHomeRoute();
  const { historyPath, handleHistoryRoute } = UseHandleHistoryRoute();
  const { purchasePath, handlePurchaseRoute } = UseHandlePurchaseRoute();

  //Determining active tabs
  const pathname = usePathname();
  let activeTab = "";

  const homeRoutes = [
    "/staffdashboard",
    "/payrolldashboard",
    "/hrdashboard",
    "/ccdashboard",
    "/bidashboard",
  ];
  const historyRoutes = [
    "/staffdashboard/purchase-history",
    "/payrolldashboard/purchases-history",
    "/hrdashboard/requests-history",
    "/ccdashboard/purchases-history",
    "/bidashboard/purchases-history",
  ];

  const purchaseRoutes = [
    "/staffdashboard/new-purchase",
    "/payrolldashboard/new-purchase",
    "/hrdashboard/new-purchase",
    "/ccdashboard/new-purchase",
    "/bidashboard/new-purchase",
  ]

  if (homeRoutes.includes(pathname)) {
    activeTab = "home";
  } else if (historyRoutes.includes(pathname)) {
    activeTab = "history";
  } else if (purchaseRoutes.includes(pathname)) {
    activeTab = "newpurchase";
  } else if (pathname === "/ccdashboard/payment-tracking") {
    activeTab = "paymentTracking";
  }

  const handleHomeClick = () => {
    if (pathname === homePath) return; //Do not start loading
    startLoading();
    handleHomeRoute();
  };

  const handleHistoryClick = () => {
    if (pathname === historyPath) return;
    startLoading();
    handleHistoryRoute();
  };

  const handlePurchaseClick = () => {
    if (pathname === purchasePath) return;
    startLoading();
    handlePurchaseRoute();
  }

  const handleNavClick = (path) => {
    if (pathname === path) return;
    startLoading();
    router.push(path);
  };

  // Hook for stopping loading line when pathname changes
  useEffect(() => {
    stopLoading();
  }, [pathname]);

  // Hook for managing the new purchase shortcut (Applys for all roles)
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for alt + N
      if (event.altKey && event.key === "n") {
        // Prevent browsers default new window action
        event.preventDefault();

        handlePurchaseClick();
      }
    };

    // Add an event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    // remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname, role]);

  return (
    <>
      {showTopbar ? (
        <TopSidebar
          role={role}
          router={router}
          handleHistoryClick={handleHistoryClick}
          handleHomeClick={handleHomeClick}
          handlePurchaseClick={handlePurchaseClick}
          handleNavClick={handleNavClick}
          activeTab={activeTab}
        />
      ) : (
        <LeftSidebar
          router={router}
          activeTab={activeTab}
          role={role}
          handleHomeClick={handleHomeClick}
          handlePurchaseClick={handlePurchaseClick}
          handleHistoryClick={handleHistoryClick}
          handleNavClick={handleNavClick}
        />
      )}
    </>
  );
}
