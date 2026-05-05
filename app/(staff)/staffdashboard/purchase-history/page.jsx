import ApprovalCards from "@/components/Reusables/ReusableApprovalCards/ApprovalCards";
import StaffPurchaseHistory from "@/components/staff/StaffPurchaseHistory";

export default function PurchaseHistory() {
  return (
    <>
      <ApprovalCards />
      <StaffPurchaseHistory fetchAllData={true} />
    </>
  );
}
