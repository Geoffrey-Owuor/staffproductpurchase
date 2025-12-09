// app/components/Hero.js
import { ShoppingBag, ArrowRight, Check, BookMarked } from "lucide-react";
import Link from "next/link";
import LandingLogo from "./LandingLogo";

export default function Hero() {
  return (
    <section className="py-20">
      <div className="px-6">
        <div className="flex flex-col items-center lg:flex-row">
          {/* Left content */}
          <div className="mb-10 w-full lg:mb-0 lg:w-1/2">
            {/* Landing Logo - Reserving a fixed height for it */}
            <div className="">
              <LandingLogo />
            </div>

            <h1 className="mb-6 text-center text-4xl font-bold text-gray-900 md:text-5xl lg:text-start dark:text-gray-100">
              <span className="text-red-600 dark:text-red-500">
                Staff Purchase Portal
              </span>
            </h1>
            <p className="mb-8 text-center text-lg text-gray-600 lg:text-start dark:text-gray-300">
              Easily make your product purchase requisition through our Hotpoint
              Staff Purchase Portal
            </p>
            <div className="flex flex-col items-center space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <Link
                href="/register"
                className="flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                How It Works <BookMarked className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Right content (card with features) */}
          <div className="flex w-full justify-center lg:w-1/2">
            <div className="relative w-full lg:max-w-md">
              {/* Blurred background accents */}
              <div className="absolute -top-6 -left-6 h-64 w-64 rounded-full bg-red-100 opacity-70 mix-blend-multiply blur-xl filter dark:bg-red-900/40"></div>
              <div className="absolute -right-8 -bottom-8 h-64 w-64 rounded-full bg-rose-100 opacity-70 mix-blend-multiply blur-xl filter dark:bg-rose-900/40"></div>

              {/* Card */}
              <div className="relative rounded-3xl bg-white p-8 shadow-xl dark:border dark:border-gray-800 dark:bg-gray-900/50">
                <div className="mb-6 flex items-center">
                  <div className="mr-4 rounded-2xl bg-red-100 p-3 dark:bg-red-900/40">
                    <ShoppingBag className="h-6 w-6 text-red-600 dark:text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Staff Purchase Portal
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Exclusive employee discounts
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Easy online requisition
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Track your purchase status
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Access with your work account
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
