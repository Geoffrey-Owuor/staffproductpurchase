// app/components/Features.js
import { Pencil, ShieldCheck, Zap } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="bg-white py-20 dark:bg-gray-950">
      <div className="px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">
            Features
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            The following are some of the features of the Staff Purchase Portal
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-3xl bg-gray-50 p-8 transition hover:shadow-md dark:bg-gray-900 dark:hover:shadow-lg">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 p-3 dark:bg-red-900/40">
              <Pencil className="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Purchase Form Edit
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Edit your form directly from your dashboard before it reaches
              final approval
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl bg-gray-50 p-8 transition hover:shadow-md dark:bg-gray-900 dark:hover:shadow-lg">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100 p-3 dark:bg-rose-900/40">
              <ShieldCheck className="h-6 w-6 text-rose-600 dark:text-rose-500" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Priority Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get dedicated staff service and technical support for all your
              employee purchases.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl bg-gray-50 p-8 transition hover:shadow-md dark:bg-gray-900 dark:hover:shadow-lg">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 p-3 dark:bg-red-900/40">
              <Zap className="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Purchase History
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track your previous product purchases history directly in your
              staff dashboard
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
