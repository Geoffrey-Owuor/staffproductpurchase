import ApprovalCards from "@/components/Reusables/ReusableApprovalCards/ApprovalCards";
import StaffPurchaseHistory from "@/components/staff/StaffPurchaseHistory";
import TermsConditions from "@/components/TermsConditions";
import { StaffPurchaseProvider } from "@/context/StaffPurchaseContext";

export default function StaffHomePage() {
  return (
    <StaffPurchaseProvider fetchAllData={false}>
      <ApprovalCards />
      <StaffPurchaseHistory />
      <TermsConditions />
    </StaffPurchaseProvider>
  );
}
