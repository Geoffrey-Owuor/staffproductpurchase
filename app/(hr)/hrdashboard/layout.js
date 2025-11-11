import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import UnauthorizedPage from "@/components/Reusables/UnauthorizedPage";
import ReusableLayoutShell from "@/components/Reusables/ReuseLayoutShell/ReusableLayoutShell";
import { FirstLoader } from "@/components/Reusables/FirstLoader";
import { ApprovalCountsProvider } from "@/context/ApprovalCountsContext";

export const metadata = {
  title: "HAL - HR Dashboard",
  description: "Hotpoint HR Dashboard",
};

export default async function layout({ children }) {
  const user = await getCurrentUser();

  if (!user?.valid) {
    return redirect("/login");
  }

  if (user.role !== "hr") {
    return <UnauthorizedPage />;
  }

  return (
    <>
      <FirstLoader />
      <ReusableLayoutShell user={user}>
        <ApprovalCountsProvider>{children}</ApprovalCountsProvider>
      </ReusableLayoutShell>
    </>
  );
}
