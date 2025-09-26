// app/components/Footer.js
import { ShoppingBag } from "lucide-react";
import ThemeToggle from "../Reusables/ThemeProviders/ThemeToggle";
import { BrainCog } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white py-12 text-gray-700 dark:bg-gray-950 dark:text-white">
      <div className="px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-950 dark:bg-white">
                <ShoppingBag className="h-5 w-5 text-white dark:text-gray-950" />
              </div>
              <span className="text-xl font-bold">Hotpoint Staff</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Exclusive employee purchase portal for Hotpoint team members.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Features", "How It Works", "Testimonials", "FAQs"].map(
                (item, idx) => (
                  <li key={idx}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-gray-600 transition hover:text-red-600 dark:text-gray-400 dark:hover:text-white"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Support
            </h3>
            <ul className="space-y-2">
              {[
                "Contact Us",
                "Help Center",
                "Privacy Policy",
                "Terms of Service",
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-gray-600 transition hover:text-red-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Connect With Us
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Have questions? Our team is here to help.
            </p>
            <a
              href="mailto:info@hotpoint.co.ke"
              className="text-red-600 transition hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
            >
              info@hotpoint.co.ke
            </a>
          </div>
        </div>

        {/* The bottom part */}
        <div className="relative mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          {/* Centered Part */}
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <span>
              © {new Date().getFullYear()} Hotpoint Appliances Ltd. Built by
            </span>
            <span className="font-semibold">Jeff</span>

            <BrainCog className="h-3.5 w-3.5" />
          </div>

          {/* ThemeToggle pinned right */}
          <div className="absolute top-11.5 right-0 -translate-y-1/2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
