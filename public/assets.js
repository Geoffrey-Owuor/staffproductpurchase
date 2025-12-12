import hotpoint_logo from "./hotpoint_logo.webp";
import hotpoint_white_logo from "./hotpoint_white_logo.webp";
import dark_mode_bg from "./dark_mode_bg.svg";
import light_mode_bg from "./light_mode_bg.svg";
import Link from "next/link";

import { ShoppingBag } from "lucide-react";

export const assets = {
  dark_mode_bg,
  light_mode_bg,
  hotpoint_logo,
  hotpoint_white_logo,
};

export const formatDateLong = (dateString) => {
  if (!dateString) return "dd/mm/yy";
  const date = new Date(dateString);
  if (isNaN(date)) return "n/a"; // invalid date check
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatCreditPeriod = (period) => {
  if (!period) return "N/A";
  return `${period} month${Number(period) != 1 ? "s" : ""}`;
};

export const AuthPagesLogo = () => {
  return (
    <Link href="/">
      <div className="flex items-center gap-1 text-2xl font-bold">
        <ShoppingBag className="h-6 w-6 text-gray-950 dark:text-white" />
        <span className="text-gray-900 dark:text-gray-100">
          Hot<span className="text-red-600 dark:text-red-500">p</span>oint
        </span>
      </div>
    </Link>
  );
};
