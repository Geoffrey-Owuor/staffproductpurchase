// app/components/Hero.js
import { assets } from "@/public/assets";
import { ShoppingBag, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-red-50 to-rose-50 py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="mb-10 md:mb-0 md:w-1/2">
            <Image
              src={assets.hotpoint_logo}
              alt="hotpoint logo"
              className="w-120"
              priority
            />
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              <span className="text-red-600">Staff Purchase Portal</span>
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Easily make your product purchase requisition through our Hotpoint
              Staff Purchase Portal
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link
                href="/register"
                className="flex items-center justify-center rounded-full bg-red-600 px-6 py-3 font-medium text-white shadow-md transition hover:bg-red-700"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                How It Works
              </a>
            </div>
          </div>
          <div className="flex justify-center md:w-1/2">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 h-64 w-64 rounded-full bg-red-100 opacity-70 mix-blend-multiply blur-xl filter"></div>
              <div className="absolute -right-8 -bottom-8 h-64 w-64 rounded-full bg-rose-100 opacity-70 mix-blend-multiply blur-xl filter"></div>
              <div className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
                <div className="mb-6 flex items-center">
                  <div className="mr-4 rounded-2xl bg-red-100 p-3">
                    <ShoppingBag className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Staff Purchase Portal
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-gray-700">
                      Exclusive employee discounts
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-gray-700">
                      Easy online requisition
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-gray-700">
                      Track your purchase status
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-gray-700">
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
