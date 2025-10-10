import GeneralEditPurchases from "@/components/generaleditpurchases/GeneralEditPurchases";

export default async function BIEditPurchase({ params }) {
  const { id } = await params;

  return <GeneralEditPurchases id={id} />;
}
