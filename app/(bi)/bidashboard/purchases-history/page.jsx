import ApprovalCards from "@/components/Reusables/ReusableApprovalCards/ApprovalCards";
import PurchasesHistory from "@/components/PurchasesTables/PurchasesHistory";

export default function BiPurchasesHistory() {
  return (
    <>
      <ApprovalCards />
      <PurchasesHistory fetchAllData={true} />
    </>
  );
}
