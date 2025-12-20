import { FileSliders } from "lucide-react";
import TopBarButtons from "../Reusables/TopBarButtons/TopBarButtons";

export default function EditPurchaseHeading() {
  return (
    <>
      <div className="flex items-center justify-between px-2 pt-2 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manage Request
          </h2>
          <FileSliders className="h-6 w-6 text-gray-900 dark:text-white" />
        </div>
        <TopBarButtons />
      </div>
    </>
  );
}
