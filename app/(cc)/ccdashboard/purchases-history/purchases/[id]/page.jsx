import GeneralViewPurchases from "@/components/generalviewpurchases/GeneralViewPurchases";

export default async function CCViewPurchase({ params }) {
  const { id } = await params;
  return <GeneralViewPurchases id={id} />;
}
