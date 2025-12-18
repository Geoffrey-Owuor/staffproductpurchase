export const revalidate = 8400; //Refresh Fallback - revalidate after 24 hrs

import ChangeLogRoute from "@/components/ChangeLog/ChangeLogRoute";
import Header from "@/components/landingpage/Header";
import { Suspense } from "react";
import ChangelogSkeleton from "@/components/skeletons/ChangeLogSkeleton";
import PagesFooter from "@/components/Reusables/PagesFooter/PagesFooter";

const page = () => {
  return (
    <>
      <Header />
      <Suspense fallback={<ChangelogSkeleton />}>
        <ChangeLogRoute />
      </Suspense>
      <PagesFooter />
    </>
  );
};

export default page;
