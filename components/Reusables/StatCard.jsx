export const StatCard = ({ title, count, description, IconComponent }) => {
  // Dynamic Backgrounds
  const dynamicBackgrounds = {
    Pending: "bg-yellow-50",
    Open: "bg-yellow-50",
    Closed: "bg-blue-50",
    Declined: "bg-red-50",
    Approved: "bg-green-50",
  };

  // Dynamic Icon colors and Icon Backgrounds
  const dynamicIcons = {
    Pending: "bg-yellow-100 text-yellow-500",
    Open: "bg-yellow-100 text-yellow-500",
    Closed: "bg-blue-100 text-blue-500",
    Declined: "bg-red-100 text-red-500",
    Approved: "bg-green-100 text-green-500",
  };

  return (
    <div
      className={`rounded-2xl ${dynamicBackgrounds[title]} p-6 dark:bg-gray-800`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {title}
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {count}
          </p>
        </div>
        <div
          className={`rounded-full p-3 dark:bg-gray-700 ${dynamicIcons[title]} dark:text-white`}
        >
          <IconComponent className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-700 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};
