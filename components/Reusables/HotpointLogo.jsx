import { ShoppingBagIcon } from "lucide-react";
export default function HotpointLogo({ isOpen }) {
  return (
    <div className="flex items-center gap-0.5">
      <ShoppingBagIcon className="h-6 w-6 text-gray-900 dark:text-white" />
      <span
        className={`overflow-hidden text-2xl font-bold whitespace-nowrap text-gray-900 ${isOpen ? "w-30" : "w-0"} transition-all duration-200 dark:text-white`}
      >
        Hot<span className="text-red-600 dark:text-red-500">p</span>oint
      </span>
    </div>
  );
}
