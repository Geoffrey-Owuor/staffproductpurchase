"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import ThemeToggleCompact from "../Reusables/ThemeProviders/ThemeToggleCompact";
import Link from "next/link";
import { LandingPageLogo } from "@/public/assets";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "custom-blur bg-white/70 shadow-sm dark:bg-gray-950/70"
          : "bg-white dark:bg-gray-950"
      }`}
    >
      <div className="containerizing flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <LandingPageLogo />

        {/* Navigation */}
        <nav className="navigation:flex hidden space-x-8 px-6">
          <a
            href="/#features"
            className="flex items-center gap-2 text-gray-600 transition hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
          >
            Features
            <ChevronDown className="mt-0.5 h-4 w-4" />
          </a>
          <a
            href="/#how-it-works"
            className="flex items-center gap-2 text-gray-600 transition hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
          >
            How It Works
            <ChevronDown className="mt-0.5 h-4 w-4" />
          </a>
          <Link
            href="/usermanual"
            className="flex items-center gap-2 text-gray-600 transition hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
          >
            User Manual
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>

        {/* Auth Buttons  */}
        <div className="flex items-center space-x-4">
          {/* Theme switcher in a fixed space div */}
          <div className="w-8">
            <ThemeToggleCompact />
          </div>
          <Link
            href="/login"
            className="cursor-default rounded-xl px-3 py-1.5 font-semibold text-red-600 transition hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-600/20"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="cursor-default rounded-xl bg-red-600 px-3 py-1.5 font-semibold text-white shadow-sm transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
