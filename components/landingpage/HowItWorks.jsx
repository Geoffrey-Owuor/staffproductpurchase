// app/components/HowItWorks.js
import { Users, Scroll, Send, AudioWaveform } from "lucide-react";

const steps = [
  {
    id: 1,
    number: 1,
    icon: Users,
    title: "Register",
    description: "Create your account using your company credentials",
  },
  {
    id: 2,
    number: 2,
    icon: Scroll,
    title: "Details",
    description: "Go to the new purchase tab and fill in the required details",
  },
  {
    id: 3,
    number: 3,
    icon: Send,
    title: "Submit",
    description: "Submit the form, view new requisition in purchases history",
  },
  {
    id: 4,
    number: 4,
    icon: AudioWaveform,
    title: "Track",
    description: "View your form approval status for various departments",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            How It Works
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Get started with your employee purchases in just a few simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                  <span className="text-xl font-bold text-red-600 dark:text-red-500">
                    {step.number}
                  </span>
                </div>
                <div className="w-full rounded-2xl bg-slate-50 p-3 shadow-sm dark:bg-gray-900/50">
                  <Icon className="mx-auto mb-3 h-8 w-8 text-red-600 dark:text-red-500" />
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
