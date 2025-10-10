import GeneralEditPurchases from "@/components/generaleditpurchases/GeneralEditPurchases";

export default async function HREditPurchase({ params }) {
  const { id } = await params;

  return <GeneralEditPurchases id={id} />;
}
