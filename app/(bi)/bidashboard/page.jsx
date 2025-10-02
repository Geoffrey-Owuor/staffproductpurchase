import BIApprovalCards from "@/components/bi/BIApprovalCards";
import TermsConditions from "@/components/TermsConditions";
import RecentPurchases from "@/components/PurchasesTables/RecentPurchases";

export default function BIHomePage() {
  return (
    <>
      <BIApprovalCards />
      <RecentPurchases />
      <TermsConditions />
    </>
  );
}
