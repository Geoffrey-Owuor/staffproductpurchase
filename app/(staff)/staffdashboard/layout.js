import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import UnauthorizedPage from "@/components/Reusables/UnauthorizedPage";
import ReusableLayoutShell from "@/components/Reusables/ReuseLayoutShell/ReusableLayoutShell";

export const metadata = {
  title: "HAL - Staff Dashboard",
  description: "Hotpoint Staff Dashboard",
};

export default async function layout({ children }) {
  const user = await getCurrentUser();

  if (!user?.valid) {
    return redirect("/login");
  }

  if (user.role !== "staff") {
    return <UnauthorizedPage />;
  }

  return <ReusableLayoutShell user={user}>{children}</ReusableLayoutShell>;
}
