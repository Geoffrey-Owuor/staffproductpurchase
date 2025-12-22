import { ShoppingBagIcon } from "lucide-react";
import { assets } from "@/public/assets";
import Image from "next/image";
export default function HotpointLogo({ isOpen }) {
  return (
    <div className="relative flex items-center gap-1">
      <Image
        src={assets.hat}
        alt="christmas hat"
        className={`absolute bottom-1 left-5.5 w-6 transition-all duration-200 ${isOpen ? "custom:w-6" : "custom:w-0"}`}
      />
      <ShoppingBagIcon className="h-5 w-5 text-gray-900 dark:text-white" />
      <span
        className={`overflow-hidden text-xl font-semibold whitespace-nowrap text-gray-900 ${isOpen ? "custom:w-30" : "custom:w-0"} transition-all duration-200 dark:text-white`}
      >
        Hot<span className="text-red-600 dark:text-red-500">p</span>oint
      </span>
    </div>
  );
}
