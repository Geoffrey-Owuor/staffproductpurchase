import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import UnauthorizedPage from "@/components/Reusables/UnauthorizedPage";
import ReusableLayoutShell from "@/components/Reusables/ReuseLayoutShell/ReusableLayoutShell";
import { FirstLoader } from "@/components/Reusables/FirstLoader";

export const metadata = {
  title: "HAL - Billing & Invoice Dashboard",
  description: "Hotpoint Billing & Invoice Dashboard",
};

export default async function layout({ children }) {
  const user = await getCurrentUser();

  if (!user?.valid) {
    redirect("/login");
  }

  if (user.role !== "bi") {
    return <UnauthorizedPage />;
  }

  return (
    <>
      <FirstLoader />
      <ReusableLayoutShell user={user}>{children}</ReusableLayoutShell>
    </>
  );
}
