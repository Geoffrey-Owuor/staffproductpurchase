import { FileSliders } from "lucide-react";
import TopBarButtons from "../Reusables/TopBarButtons/TopBarButtons";

export default function EditPurchaseHeading() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSliders className="h-6 w-6 text-gray-900 dark:text-white" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manage Request
          </h2>
        </div>
        <TopBarButtons />
      </div>
    </>
  );
}
