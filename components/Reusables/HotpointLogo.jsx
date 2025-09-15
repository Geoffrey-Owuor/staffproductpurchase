import { ShoppingBagIcon } from "lucide-react";
export default function HotpointLogo() {
  return (
    <div className="mb-1.5 flex items-center gap-0.5 pr-14.5 pl-2.5">
      <ShoppingBagIcon className="h-7 w-7 text-gray-900 dark:text-white" />
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
        Hot<span className="text-red-600 dark:text-red-500">p</span>oint
      </span>
    </div>
  );
}
