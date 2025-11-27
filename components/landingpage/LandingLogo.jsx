"use client";
import { useEffect, useState } from "react";
import { assets } from "@/public/assets";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="relative flex justify-start overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme} // Key triggers animation on theme change
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image src={logoSrc} alt="hotpoint logo" className="w-120" priority />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LandingLogo;
