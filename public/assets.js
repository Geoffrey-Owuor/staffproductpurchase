import hotpoint_logo from "./hotpoint_logo.webp";
import hotpoint_white_logo from "./hotpoint_white_logo.webp";

import { ShoppingBag } from "lucide-react";

export const assets = {
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
    <a href="/">
      <div className="flex items-center space-x-2 text-3xl font-bold">
        <ShoppingBag className="h-8 w-8 text-gray-950 dark:text-white" />
        <span className="text-gray-900 dark:text-gray-100">
          Hot<span className="text-red-600 dark:text-red-500">p</span>oint
        </span>
      </div>
    </a>
  );
};
