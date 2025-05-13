"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
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
          ? "bg-white/70 shadow-sm backdrop-blur"
          : "bg-gradient-to-r from-red-50 to-rose-50"
      }`}
    >
      <div className="container mx-auto max-w-none px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#">
            <div className="flex items-center space-x-2 text-3xl font-bold">
              <ShoppingBag className="h-8 w-8 text-red-600" />
              Hot<span className="text-red-600">point</span>
            </div>
          </a>

          {/* Navigation */}
          <nav
            className={`hidden items-center space-x-8 px-6 py-2 md:flex ${
              scrolled ? "" : "rounded-full bg-white/50 shadow backdrop-blur"
            }`}
          >
            <a
              href="#features"
              className="font-medium text-gray-600 transition hover:text-red-600"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="font-medium text-gray-600 transition hover:text-red-600"
            >
              How It Works
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 font-medium text-red-600 transition hover:bg-red-100"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-red-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-red-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
