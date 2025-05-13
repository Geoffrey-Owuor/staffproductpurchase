// app/components/CTA.js
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-red-600 to-rose-600 py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
          Ready to Access Your Employee Benefits?
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-xl text-red-100">
          Join hundreds of Hotpoint employees who are already enjoying exclusive
          discounts and perks.
        </p>
        <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Link
            href="/register"
            className="flex items-center justify-center rounded-full bg-white px-8 py-3 font-medium text-red-600 shadow-lg transition hover:bg-gray-100"
          >
            Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center rounded-full border border-white px-8 py-3 font-medium text-white transition hover:bg-red-700"
          >
            Existing User? Log In
          </Link>
        </div>
      </div>
    </section>
  );
}
