import hotpoint_logo from "./hotpoint_logo.webp";
import hotpoint_white_logo from "./hotpoint_white_logo.webp";
import dark_mode_bg from "./dark_mode_bg.svg";
import light_mode_bg from "./light_mode_bg.svg";
import Image from "next/image";
import hat from "./hat.png";
import Link from "next/link";

import { ShoppingBag } from "lucide-react";

export const assets = {
  hat,
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
      <div className="relative flex items-center gap-1 text-2xl font-semibold">
        {/* <Image
          src={assets.hat}
          alt="christmas hat"
          className="absolute bottom-1.5 left-6.5 w-7 sm:bottom-1"
        />*/}
        <ShoppingBag className="h-6 w-6 text-gray-950 dark:text-white" />
        <span className="mt-1 text-gray-900 sm:mt-0 dark:text-gray-100">
          Hot<span className="text-red-600 dark:text-red-500">p</span>oint
        </span>
      </div>
    </Link>
  );
};

export const LandingPageLogo = () => {
  return (
    <a href="/#">
      <div className="relative flex items-center gap-1 text-2xl font-semibold">
        {/* <Image
          src={assets.hat}
          alt="christmas hat"
          className="absolute bottom-1.5 left-6.5 w-7 sm:bottom-1"
        />*/}
        <ShoppingBag className="h-6 w-6 text-gray-950 dark:text-white" />
        <span className="mt-1 text-gray-900 sm:mt-0 dark:text-gray-100">
          Hot<span className="text-red-600 dark:text-red-500">p</span>oint
        </span>
      </div>
    </a>
  );
};
