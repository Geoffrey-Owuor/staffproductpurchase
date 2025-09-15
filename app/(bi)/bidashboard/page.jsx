import BIApprovalCards from "@/components/bi/BIApprovalCards";
import BITablePurchases from "@/components/bi/BITablePurchases";
import TermsConditions from "@/components/TermsConditions";

export default function BIHomePage() {
  return (
    <>
      <BIApprovalCards />
      <BITablePurchases />
      <TermsConditions />
    </>
  );
}
