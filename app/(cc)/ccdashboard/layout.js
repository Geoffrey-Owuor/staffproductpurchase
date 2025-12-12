import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import UnauthorizedPage from "@/components/Reusables/UnauthorizedPage";
import ReusableLayoutShell from "@/components/Reusables/ReuseLayoutShell/ReusableLayoutShell";
import { FirstLoader } from "@/components/Reusables/FirstLoader";
import { ApprovalCountsProvider } from "@/context/ApprovalCountsContext";
import { TrackingApprovalCardsProvider } from "@/context/TrackingApprovalCardsContext";

export const metadata = {
  title: "HAL - Credit Control Dashboard",
  description: "Hotpoint Credit Control Dashboard",
};

export default async function layout({ children }) {
  const user = await getCurrentUser();

  if (!user?.valid) {
    return redirect("/login");
  }

  if (user.role !== "cc") {
    return <UnauthorizedPage />;
  }

  return (
    <>
      <FirstLoader />
      <ReusableLayoutShell user={user}>
        <TrackingApprovalCardsProvider>
          <ApprovalCountsProvider>{children}</ApprovalCountsProvider>
        </TrackingApprovalCardsProvider>
      </ReusableLayoutShell>
    </>
  );
}
