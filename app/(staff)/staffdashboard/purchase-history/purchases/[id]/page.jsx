import GeneralViewPurchases from "@/components/generalviewpurchases/GeneralViewPurchases";
import { PurchaseProvider } from "@/context/PurchaseDetailsContext";

export default async function StaffViewPurchase({ params }) {
  const { id } = await params;

  return (
    <PurchaseProvider id={id}>
      <GeneralViewPurchases id={id} />
    </PurchaseProvider>
  );
}
