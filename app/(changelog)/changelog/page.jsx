export const revalidate = 8400; //Refresh Fallback - revalidate after 24 hrs

import ChangeLogRoute from "@/components/ChangeLog/ChangeLogRoute";
import Header from "@/components/landingpage/Header";
import { Suspense } from "react";
import ChangelogSkeleton from "@/components/skeletons/ChangeLogSkeleton";
import PagesFooter from "@/components/Reusables/PagesFooter/PagesFooter";

const page = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense fallback={<ChangelogSkeleton />}>
        <main className="flex-1">
          <ChangeLogRoute />
        </main>
      </Suspense>
      <PagesFooter />
    </div>
  );
};

export default page;
