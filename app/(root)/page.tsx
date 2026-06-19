import Chart from "@/components/Chart";
import DashboardCard from "@/components/DashboardCard";
import RecentUploads from "@/components/RecentUploads";
import { getFiles } from "@/lib/actions/file.actions";
import { getCurrentUser } from "@/lib/actions/user.action";

const page = async () => {
  const currentUser = await getCurrentUser();
  const filesResponse = await getFiles({});
  const files = filesResponse.documents;

  return (
    <div className="dashboard-container">
      <div className="flex flex-col gap-x-3 w-full">
        <Chart files={files} />
        <DashboardCard files={files} />
      </div>
      <div className="w-full">
        <RecentUploads files={files} {...currentUser} />
      </div>
    </div>
  );
};

export default page;
