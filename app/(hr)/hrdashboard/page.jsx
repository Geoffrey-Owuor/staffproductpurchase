import ApprovalCards from "@/components/Reusables/ReusableApprovalCards/ApprovalCards";
import TermsConditions from "@/components/TermsConditions";
import PurchasesHistory from "@/components/PurchasesTables/PurchasesHistory";

export default function HrHomePage() {
  return (
    <>
      <ApprovalCards />
      <PurchasesHistory fetchAllData={false} />
      <TermsConditions />
    </>
  );
}
