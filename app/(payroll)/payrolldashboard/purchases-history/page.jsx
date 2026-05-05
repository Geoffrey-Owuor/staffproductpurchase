import ApprovalCards from "@/components/Reusables/ReusableApprovalCards/ApprovalCards";
import PurchasesHistory from "@/components/PurchasesTables/PurchasesHistory";

export default function PayrollPurchasesHistory() {
  return (
    <>
      <ApprovalCards />
      <PurchasesHistory fetchAllData={true} />
    </>
  );
}
