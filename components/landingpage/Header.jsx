"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import ThemeToggleCompact from "../Reusables/ThemeProviders/ThemeToggleCompact";
import Link from "next/link";

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
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#">
            <div className="flex items-center space-x-2 text-3xl font-bold">
              <ShoppingBag className="h-8 w-8 text-gray-950 dark:text-white" />
              <span className="text-gray-900 dark:text-gray-100">
                Hot<span className="text-red-600 dark:text-red-500">p</span>oint
              </span>
            </div>
          </a>

          {/* Navigation */}
          <nav
            className={`hidden items-center space-x-8 px-6 py-2 md:flex ${
              scrolled
                ? "dark:text-gray-200"
                : "rounded-full bg-white/50 shadow backdrop-blur dark:bg-gray-800/50"
            }`}
          >
            <a
              href="#features"
              className="font-medium text-gray-600 transition hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="font-medium text-gray-600 transition hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
            >
              How It Works
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Switcher */}
            <ThemeToggleCompact />
            <Link
              href="/login"
              className="cursor-default rounded-full px-4 py-2 font-medium text-red-600 transition hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-800"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="cursor-default rounded-full bg-red-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
