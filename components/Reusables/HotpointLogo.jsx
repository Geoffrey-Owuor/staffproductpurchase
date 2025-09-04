import { ShoppingBagIcon } from "lucide-react";
export default function HotpointLogo() {
  return (
    <div className="mb-1.5 flex items-center gap-0.5 pr-17 pl-2.5">
      <ShoppingBagIcon className="h-7 w-7 text-red-700" />
      <span className="text-2xl font-bold text-gray-900">
        Hot<span className="text-red-700">p</span>oint
      </span>
    </div>
  );
}
