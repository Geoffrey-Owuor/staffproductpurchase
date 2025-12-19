import { cachedChangelogs } from "@/app/lib/fetchChangelogs";
import ChangeLogWrapper from "./ChangeLogWrapper";

const ChangeLogRoute = async () => {
  const changelogs = await cachedChangelogs();

  return <ChangeLogWrapper changelogs={changelogs} />;
};

export default ChangeLogRoute;
