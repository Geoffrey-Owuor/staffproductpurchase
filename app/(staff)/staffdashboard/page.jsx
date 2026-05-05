import ApprovalCards from "@/components/Reusables/ReusableApprovalCards/ApprovalCards";
import StaffPurchaseHistory from "@/components/staff/StaffPurchaseHistory";
import TermsConditions from "@/components/TermsConditions";

export default function StaffHomePage() {
  return (
    <>
      <ApprovalCards />
      <StaffPurchaseHistory fetchAllData={false} />
      <TermsConditions />
    </>
  );
}
