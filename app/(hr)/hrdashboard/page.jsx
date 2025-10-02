import HRApprovalCards from "@/components/hr/HRApprovalCards";
import TermsConditions from "@/components/TermsConditions";
import RecentPurchases from "@/components/PurchasesTables/RecentPurchases";

export default function HrHomePage() {
  return (
    <>
      <HRApprovalCards />
      <RecentPurchases />
      <TermsConditions />
    </>
  );
}
