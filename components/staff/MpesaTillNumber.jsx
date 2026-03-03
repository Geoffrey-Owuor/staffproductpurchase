"use client";
import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

export default function MpesaTillNumber() {
  const [copied, setCopied] = useState(false);
  const tillNumber = "80057";

  const handleCopy = async () => {
    try {
      // 1. Try the modern Clipboard API first
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(tillNumber);
      } else {
        // 2. Fallback for older browsers and HTTP environments (Mobile Webviews)
        const textArea = document.createElement("textarea");
        textArea.value = tillNumber;

        // Prevent scrolling to the bottom of the page in MS Edge / older browsers
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        // Execute the copy command
        document.execCommand("copy");

        // Clean up
        textArea.remove();
      }

      // Trigger success state
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <div className="px-2">
      {/* Single compact rounded container */}
      <div className="relative mb-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:max-w-[280px] dark:border-gray-800 dark:bg-gray-950">
        {/* Title */}
        <p className="mb-1 font-mono text-[11px] font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
          Hotpoint Till Number
        </p>

        {/* Till Number & Copy Button Row */}
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-3xl font-bold tracking-widest text-gray-900 dark:text-white">
            {tillNumber}
          </span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              copied
                ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                : "bg-green-600 text-white hover:bg-green-700 active:scale-95 dark:bg-green-700 dark:hover:bg-green-600"
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Footer Text & Visual Indicator */}
        <div className="flex items-center justify-between pt-1 text-green-600 dark:text-green-500">
          <p className="font-mono text-[10px] font-bold tracking-widest uppercase">
            Powered by M-Pesa
          </p>
          <div className="flex gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-green-400 dark:bg-green-600"
                style={{ height: `${6 + i * 3}px`, marginTop: "auto" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
