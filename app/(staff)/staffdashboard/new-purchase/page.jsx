//Revalidate after 30mins
export const revalidate = 1800;

import NewPurchase from "@/components/staff/NewPurchase";
import TermsConditions from "@/components/TermsConditions";

export default function Page() {
  return (
    <>
      <NewPurchase />
      <TermsConditions />
    </>
  );
}
