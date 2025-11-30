"use client";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { UseHandleHomeRoute } from "@/utils/HandleActionClicks/useHandleHomeRoute";
import { UseHandleHistoryRoute } from "@/utils/HandleActionClicks/useHandleHistoryRoute";
import LoadingLine from "../LoadingLine";
import { useFinishLoading } from "@/hooks/useFinishLoading";
import { Undo2, ArrowLeft, History } from "lucide-react";

export default function TopBarButtons() {
  const [isLoadingline, setIsLoadingLine] = useState(false);

  const handleHomeRoute = UseHandleHomeRoute();
  const handleHistoryRoute = UseHandleHistoryRoute();
  const router = useRouter();

  const gotoHomeClick = () => {
    setIsLoadingLine(true);
    handleHomeRoute();
  };

  const gotoHistoryClick = () => {
    setIsLoadingLine(true);
    handleHistoryRoute();
  };

  useFinishLoading(isLoadingline, setIsLoadingLine);
  return (
    <>
      <AnimatePresence>{isLoadingline && <LoadingLine />}</AnimatePresence>

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
    </>
  );
}
