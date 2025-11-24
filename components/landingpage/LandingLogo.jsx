"use client";
import { useEffect, useState } from "react";
import { assets } from "@/public/assets";
import Image from "next/image";
import { useTheme } from "next-themes";

const LandingLogo = () => {
  const { theme, systemTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const logoSrc =
    currentTheme === "dark" ? assets.hotpoint_white_logo : assets.hotpoint_logo;
  return (
    <Image
      src={logoSrc}
      alt="hotpoint logo"
      className="w-120 dark:brightness-90"
      priority
    />
  );
};

export default LandingLogo;
