"use client";
import { useRouter } from "next/navigation";
import { UseHandleHomeRoute } from "@/utils/HandleActionClicks/useHandleHomeRoute";
import { UseHandleHistoryRoute } from "@/utils/HandleActionClicks/useHandleHistoryRoute";
import { Undo2, ArrowLeft, History } from "lucide-react";
import { useLoadingLine } from "@/context/LoadingLineContext";

export default function TopBarButtons() {
  const { startLoading } = useLoadingLine();
  const handleHomeRoute = UseHandleHomeRoute();
  const handleHistoryRoute = UseHandleHistoryRoute();
  const router = useRouter();

  const gotoHomeClick = () => {
    startLoading();
    handleHomeRoute();
  };

  const gotoHistoryClick = () => {
    startLoading();
    handleHistoryRoute();
  };

  return (
    <div className="hidden items-center justify-end gap-4 md:flex">
      <button
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:hover:bg-gray-800/50"
      >
        <Undo2 className="h-5 w-5" />
        Back
      </button>
      <button
        onClick={gotoHomeClick}
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:hover:bg-gray-800/50"
      >
        <ArrowLeft className="h-5 w-5" />
        Home
      </button>
      <button
        onClick={gotoHistoryClick}
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:hover:bg-gray-800/50"
      >
        <History className="h-5 w-5" />
        History
      </button>
    </div>
  );
}
