"use client";
import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

export default function MpesaTillNumber() {
  const [copied, setCopied] = useState(false);
  const tillNumber = "80057";

  const handleCopy = () => {
    navigator.clipboard.writeText(tillNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-2">
      <div className="relative mb-4 w-full overflow-hidden rounded-xl border border-gray-200 sm:max-w-xs dark:border-gray-800">
        {/* Top accent stripe */}
        <div className="h-1.5 w-full bg-linear-to-r from-green-400 via-green-500 to-emerald-600" />

        {/* Till Number Display */}
        <div className="px-5 py-5">
          <p className="mb-2 font-mono text-xs tracking-widest text-gray-400 uppercase dark:text-gray-500">
            Hotpoint Till Number
          </p>
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 dark:border-gray-700 dark:bg-gray-900/50">
            <span className="font-mono text-3xl font-bold tracking-[0.15em] text-gray-900 dark:text-white">
              {tillNumber}
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-green-100 bg-green-50 px-5 py-3 dark:border-green-900/60 dark:bg-green-950/40">
          <p className="font-mono text-[10px] font-semibold tracking-wide text-green-700 uppercase dark:text-green-500">
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
