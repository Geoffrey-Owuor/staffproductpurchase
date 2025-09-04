import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import UnauthorizedPage from "@/components/Reusables/UnauthorizedPage";
import StaffLayoutShell from "@/components/staff/StaffLayoutShell";

export const metadata = {
  title: "HAL - Staff Dashboard",
  description: "Hotpoint Staff Dashboard",
};

export default async function layout({ children }) {
  const user = await getCurrentUser();

  if (!user?.valid) {
    redirect("/login");
  }

  if (user.role !== "staff") {
    return <UnauthorizedPage />;
  }

  return <StaffLayoutShell user={user}>{children}</StaffLayoutShell>;
}
