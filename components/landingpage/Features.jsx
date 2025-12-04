// app/components/Features.js
import { Pencil, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    id: 1,
    icon: Pencil,
    title: "Easy Submission",
    description:
      "Easily submit your purchase request and track its approval stages",
    bgColor: "bg-slate-50 dark:bg-gray-900/50",
    iconBgColor: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-500",
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Priority Support",
    description:
      "Get dedicated staff service and technical support for all your employee purchases.",
    bgColor: "bg-slate-50 dark:bg-gray-900/50",
    iconBgColor: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-500",
  },
  {
    id: 3,
    icon: Zap,
    title: "Purchase History",
    description:
      "Track your previous product purchases history directly in your staff dashboard",
    bgColor: "bg-slate-50 dark:bg-gray-900/50",
    iconBgColor: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20">
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
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className={`rounded-3xl ${feature.bgColor} p-8 transition hover:shadow-md dark:hover:shadow-lg`}
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg ${feature.iconBgColor} p-3`}
                >
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
