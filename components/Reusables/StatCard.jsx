export const StatCard = ({ title, count, description, IconComponent }) => {
  const colorStyles =
    "dark:bg-gray-700 bg-gray-200 text-gray-600 dark:text-white";

  return (
    <div className="rounded-2xl bg-gray-100 p-6 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {title}
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {count}
          </p>
        </div>
        <div className={`rounded-full p-3 ${colorStyles}`}>
          <IconComponent className={`h-6 w-6 ${colorStyles}`} />
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-700 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};
