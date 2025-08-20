"use client";

export default function DashboardFooter({ isSidebarOpen }) {
  return (
    <footer className={`bg-white ${isSidebarOpen ? "ml-56" : "ml-0"}`}>
      <div className="mx-auto max-w-4xl px-4 py-3 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Hotpoint Appliances Ltd. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
