import CCApprovalCards from "@/components/cc/CCApprovalCards";
import TermsConditions from "@/components/TermsConditions";
import RecentPurchases from "@/components/PurchasesTables/RecentPurchases";

export default function CCHomePage() {
  return (
    <>
      <CCApprovalCards />
      <RecentPurchases />
      <TermsConditions />
    </>
  );
}
