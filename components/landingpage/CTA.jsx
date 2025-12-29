// app/components/CTA.js
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-home-classes mx-6 rounded-xl bg-white py-16 dark:bg-gray-950">
      <div className="px-6 text-center">
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
          Ready to Access Your Employee Benefits?
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-300">
          Join hundreds of Hotpoint employees who are already enjoying exclusive
          discounts and perks.
        </p>
        <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Link
            href="/register"
            className="flex cursor-default items-center justify-center rounded-full bg-gray-900 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="flex cursor-default items-center justify-center rounded-full border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-red-100/50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800/50"
          >
            Existing User? Log In
          </Link>
        </div>
      </div>
    </section>
  );
}
