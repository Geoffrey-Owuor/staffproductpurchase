import NewPurchase from "@/components/staff/NewPurchase";
import TermsConditions from "@/components/TermsConditions";

export default function page() {
  return (
    <>
      <NewPurchase approversPurchasing={true} />
      <TermsConditions />
    </>
  );
}
