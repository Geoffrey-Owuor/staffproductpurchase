import ApprovalCards from "@/components/Reusables/ReusableApprovalCards/ApprovalCards";
import StaffPurchaseHistory from "@/components/staff/StaffPurchaseHistory";
import { StaffPurchaseProvider } from "@/context/StaffPurchaseContext";

export default function PurchaseHistory() {
  return (
    <StaffPurchaseProvider fetchAllData={true}>
      <ApprovalCards />
      <StaffPurchaseHistory />
    </StaffPurchaseProvider>
  );
}
