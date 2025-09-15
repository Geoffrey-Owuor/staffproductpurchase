import { useRouter } from "next/navigation";
import { ArrowLeft, FilePen } from "lucide-react";

export default function EditPurchaseHeading() {
  const router = useRouter();
  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        onClick={() => router.back()}
        className="ml-4 flex cursor-pointer items-center text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-400"
      >
        <ArrowLeft className="mr-1 h-5 w-5" />
        Go Back
      </button>
      <div className="flex items-center gap-2">
        <FilePen className="h-6 w-6 text-gray-900 dark:text-white" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Manage Purchase Request
        </h2>
      </div>

      <div className="w-24"></div>
    </div>
  );
}
