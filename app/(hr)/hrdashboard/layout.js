import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import HrLayoutShell from "@/components/hr/HrLayoutShell";
import UnauthorizedPage from "@/components/Reusables/UnauthorizedPage";
import { FirstLoader } from "@/components/Reusables/FirstLoader";

export const metadata = {
  title: "HAL - HR Dashboard",
  description: "Hotpoint HR Dashboard",
};

export default async function layout({ children }) {
  const user = await getCurrentUser();

  if (!user?.valid) {
    redirect("/login");
  }

  if (user.role !== "hr") {
    return <UnauthorizedPage />;
  }

  return (
    <>
      <FirstLoader />
      <HrLayoutShell user={user}>{children}</HrLayoutShell>
    </>
  );
}
