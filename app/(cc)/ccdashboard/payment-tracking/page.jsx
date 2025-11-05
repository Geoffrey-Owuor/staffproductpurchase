import PaymentTracking from "@/components/PaymentTracking/PaymentTracking";
import TrackingApprovalCards from "@/components/Reusables/ReusableApprovalCards/TrackingApprovalCards";

export default function page() {
  return (
    <>
      <TrackingApprovalCards />
      <PaymentTracking fetchAllData={true} />
    </>
  );
}
