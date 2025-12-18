import { fetchChangelogs } from "@/app/lib/fetchChangelogs";
import ChangeLogWrapper from "./ChangeLogWrapper";

const ChangeLogRoute = async () => {
  const changelogs = await fetchChangelogs();

  return <ChangeLogWrapper changelogs={changelogs} />;
};

export default ChangeLogRoute;
