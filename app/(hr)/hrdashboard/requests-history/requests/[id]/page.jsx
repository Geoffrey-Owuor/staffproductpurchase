import GeneralViewPurchases from "@/components/generalviewpurchases/GeneralViewPurchases";

export default async function HRViewPurchase({ params }) {
  const { id } = await params;
  return <GeneralViewPurchases id={id} />;
}
