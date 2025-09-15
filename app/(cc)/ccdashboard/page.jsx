import CCApprovalCards from "@/components/cc/CCApprovalCards";
import CCTablePurchases from "@/components/cc/CCTablePurchases";
import TermsConditions from "@/components/TermsConditions";

export default function CCHomePage() {
  return (
    <>
      <CCApprovalCards />
      <CCTablePurchases />
      <TermsConditions />
    </>
  );
}
