import ApprovalCards from "@/components/Reusables/ReusableApprovalCards/ApprovalCards";
import TermsConditions from "@/components/TermsConditions";
import PurchasesHistory from "@/components/PurchasesTables/PurchasesHistory";
import { ApproversPurchaseProvider } from "@/context/ApproversPurchaseContext";

export default function HrHomePage() {
  return (
    <ApproversPurchaseProvider fetchAllData={false}>
      <ApprovalCards />
      <PurchasesHistory />
      <TermsConditions />
    </ApproversPurchaseProvider>
  );
}
