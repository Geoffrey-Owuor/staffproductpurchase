import ApprovalCards from "@/components/Reusables/ReusableApprovalCards/ApprovalCards";
import PurchasesHistory from "@/components/PurchasesTables/PurchasesHistory";
import { ApproversPurchaseProvider } from "@/context/ApproversPurchaseContext";

export default function CCPurchasesHistory() {
  return (
    <ApproversPurchaseProvider fetchAllData={true}>
      <ApprovalCards />
      <PurchasesHistory />
    </ApproversPurchaseProvider>
  );
}
