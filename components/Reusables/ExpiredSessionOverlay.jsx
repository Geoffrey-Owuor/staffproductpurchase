"use client";

export default function ExpiredSessionOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Session Expired</h2>
        <p className="mb-6">Your session has expired. Please log in again.</p>
        <a
          href="/login"
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
