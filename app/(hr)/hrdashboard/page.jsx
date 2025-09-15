import HRApprovalCards from "@/components/hr/HRApprovalCards";
import HrTablePurchases from "@/components/hr/HrTablePurchases";
import TermsConditions from "@/components/TermsConditions";

export default function HrHomePage() {
  return (
    <>
      <HRApprovalCards />
      <HrTablePurchases />
      <TermsConditions />
    </>
  );
}
