//Revalidate after 30mins
export const revalidate = 1800;

import ApprovalCards from "@/components/Reusables/ReusableApprovalCards/ApprovalCards";
import TermsConditions from "@/components/TermsConditions";
import PurchasesHistory from "@/components/PurchasesTables/PurchasesHistory";

export default function CCHomePage() {
  return (
    <>
      <ApprovalCards />
      <PurchasesHistory fetchAllData={false} />
      <TermsConditions />
    </>
  );
}
