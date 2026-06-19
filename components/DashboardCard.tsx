import Image from "next/image";
import Link from "next/link";
import { getDashboardWidgets } from "@/constants/getDashboardWidgets";

import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";

const DashboardCard = ({ files }: { files: FileDocument[] }) => {
  const widgets = getDashboardWidgets(files);
  return (
    <div className="dashboard-summary-list ">
      {widgets.map((widget) => (
        <Link
          href={widget.url}
          key={widget.name}
          className="dashboard-summary-card"
        >
          <Image
            src={widget.icon}
            alt={widget.name}
            width={40}
            height={40}
            className="summary-type-icon"
          />
          <p className="summary-type-size">{convertFileSize(widget.size)}</p>
          <p className="summary-type-title ">{widget.name}</p>
          <p className="last-update">Last Update</p>
          <FormattedDateTime
            date={widget.lastUpdated()}
            className="body-2 text-light-100"
          />
        </Link>
      ))}
    </div>
  );
};

export default DashboardCard;
