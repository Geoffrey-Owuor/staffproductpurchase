export default function RecentPurchasesHeading() {
  return (
    <div className="mt-3 mb-2 px-1 pb-3">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Recent purchase requests
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Purchase requests submitted within the last 12 days
      </p>
    </div>
  );
}
