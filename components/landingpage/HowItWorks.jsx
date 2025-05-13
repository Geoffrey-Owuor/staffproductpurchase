// app/components/HowItWorks.js
import { Users, Scroll, Send, AudioWaveform } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Get started with your employee purchases in just a few simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-xl font-bold text-red-600">1</span>
            </div>
            <div className="w-full rounded-2xl bg-white p-3 shadow-sm">
              <Users className="mx-auto mb-3 h-8 w-8 text-red-600" />
              <h3 className="mb-2 font-semibold text-gray-900">Register</h3>
              <p className="text-sm text-gray-600">
                Create your account using your company credentials
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-xl font-bold text-red-600">2</span>
            </div>
            <div className="w-full rounded-2xl bg-white p-3 shadow-sm">
              <Scroll className="mx-auto mb-3 h-8 w-8 text-red-600" />
              <h3 className="mb-2 font-semibold text-gray-900">Details</h3>
              <p className="text-sm text-gray-600">
                Go to new purchase tab and fill in required details
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-xl font-bold text-red-600">3</span>
            </div>
            <div className="w-full rounded-2xl bg-white p-3 shadow-sm">
              <Send className="mx-auto mb-3 h-8 w-8 text-red-600" />
              <h3 className="mb-2 font-semibold text-gray-900">Submit</h3>
              <p className="text-sm text-gray-600">
                Submit the form, view new requisition in purchases history
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-xl font-bold text-red-600">4</span>
            </div>
            <div className="w-full rounded-2xl bg-white p-3 shadow-sm">
              <AudioWaveform className="mx-auto mb-3 h-8 w-8 text-red-600" />
              <h3 className="mb-2 font-semibold text-gray-900">Track</h3>
              <p className="text-sm text-gray-600">
                View your form approval status for various departments
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
