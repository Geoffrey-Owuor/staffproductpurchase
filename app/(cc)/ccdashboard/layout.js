import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import UnauthorizedPage from "@/components/Reusables/UnauthorizedPage";
import CCLayoutShell from "@/components/cc/CCLayoutShell";
import { FirstLoader } from "@/components/Reusables/FirstLoader";

export const metadata = {
  title: "HAL - Credit Control Dashboard",
  description: "Hotpoint Credit Control Dashboard",
};

export default async function layout({ children }) {
  const user = await getCurrentUser();

  if (!user?.valid) {
    redirect("/login");
  }

  if (user.role !== "cc") {
    return <UnauthorizedPage />;
  }

  return (
    <>
      <FirstLoader />
      <CCLayoutShell user={user}>{children}</CCLayoutShell>
    </>
  );
}
