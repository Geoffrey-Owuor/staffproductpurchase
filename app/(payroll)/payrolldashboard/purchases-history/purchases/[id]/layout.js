import { PurchaseProvider } from "@/context/PurchaseDetailsContext";

export default async function Layout({ params, children }) {
  const { id } = await params;
  return <PurchaseProvider id={id}>{children}</PurchaseProvider>;
}
