import StaffApprovalCards from "@/components/staff/StaffApprovalCards";
import StaffTablePurchases from "@/components/staff/StaffTablePurchases";
import TermsConditions from "@/components/TermsConditions";

export default function StaffHomePage() {
  return (
    <>
      <StaffApprovalCards />
      <StaffTablePurchases />
      <TermsConditions />
    </>
  );
}
