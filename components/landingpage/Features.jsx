// app/components/Features.js
import { Pencil, Percent, ShieldCheck, Zap } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Features
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            The following are some of the features of the Staff Purchase Portal
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-3xl bg-gray-50 p-8 transition hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 p-3">
              <Pencil className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Purchase Form Edit
            </h3>
            <p className="text-gray-600">
              Edit your form directly from your dashboard before it reaches
              final approval
            </p>
          </div>
          <div className="rounded-3xl bg-gray-50 p-8 transition hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100 p-3">
              <ShieldCheck className="h-6 w-6 text-rose-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Priority Support
            </h3>
            <p className="text-gray-600">
              Get dedicated staff service and technical support for all your
              employee purchases.
            </p>
          </div>
          <div className="rounded-3xl bg-gray-50 p-8 transition hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 p-3">
              <Zap className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Purchase History
            </h3>
            <p className="text-gray-600">
              Track your previous product purchases history directly in your
              staff dashboard
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
