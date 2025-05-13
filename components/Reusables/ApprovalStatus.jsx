// Reusable Approval Status Component
export default function ApprovalStatus({ label, status }) {
  const statusColors = {
    approved: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    yes: "bg-red-100 text-red-800",
    no: "bg-green-100 text-green-800",
  };

  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <span
        className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    </div>
  );
}
