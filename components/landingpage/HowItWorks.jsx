// app/components/HowItWorks.js
import { Users, Scroll, Send, AudioWaveform } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 dark:bg-gray-950">
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
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                1
              </span>
            </div>
            <div className="w-full rounded-2xl bg-white p-3 shadow-sm dark:bg-gray-900">
              <Users className="mx-auto mb-3 h-8 w-8 text-red-600 dark:text-red-400" />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Register
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create your account using your company credentials
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                2
              </span>
            </div>
            <div className="w-full rounded-2xl bg-white p-3 shadow-sm dark:bg-gray-900">
              <Scroll className="mx-auto mb-3 h-8 w-8 text-red-600 dark:text-red-400" />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Details
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Go to the new purchase tab and fill in the required details
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                3
              </span>
            </div>
            <div className="w-full rounded-2xl bg-white p-3 shadow-sm dark:bg-gray-900">
              <Send className="mx-auto mb-3 h-8 w-8 text-red-600 dark:text-red-400" />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Submit
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Submit the form, view new requisition in purchases history
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                4
              </span>
            </div>
            <div className="w-full rounded-2xl bg-white p-3 shadow-sm dark:bg-gray-900">
              <AudioWaveform className="mx-auto mb-3 h-8 w-8 text-red-600 dark:text-red-400" />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Track
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View your form approval status for various departments
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
