import { FileSignature } from "lucide-react";
import { CachedConditions } from "@/utils/Cache/CachedConditions";

const TermsConditions = async () => {
  const terms = await CachedConditions();
  return (
    <div className="bg-gradient-classes mx-2 mt-8 mb-2 rounded-2xl border border-gray-200 p-6 text-sm dark:border-gray-700">
      <div className="mb-4 ml-0.5 flex items-center gap-2 font-semibold">
        <FileSignature className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-xl text-gray-800 dark:text-gray-200">
          Terms & Conditions
        </h3>
      </div>
      <div className="space-y-4">
        {terms.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No Terms & Conditions available at this time
          </p>
        ) : (
          terms.map((term, index) => (
            <div key={term.condition_id || index} className="flex items-start">
              <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {index + 1}
              </span>
              <p className="leading-relaxed text-gray-700 dark:text-gray-400">
                {term.condition_description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TermsConditions;
