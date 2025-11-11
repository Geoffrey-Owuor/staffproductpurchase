import PaymentTracking from "@/components/PaymentTracking/PaymentTracking";
import TrackingApprovalCards from "@/components/Reusables/ReusableApprovalCards/TrackingApprovalCards";
import { ApproversPurchaseProvider } from "@/context/ApproversPurchaseContext";

export default function page() {
  return (
    <ApproversPurchaseProvider fetchAllData={true} biApproval={true}>
      <TrackingApprovalCards />
      <PaymentTracking />
    </ApproversPurchaseProvider>
  );
}
