import Link from "next/link";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import ActionDropdown from "./ActionDropdown";

interface props {
  $id: string;
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
}

const Card = ({
  file,
  currentUser,
  selectedFile,
}: {
  file: FileDocument;
  currentUser: props;
  selectedFile: boolean;
}) => {
  return (
    <div className={`file-card ${selectedFile ? "bg-rose-300" : "bg-white"}`}>
      <div className="flex justify-between">
        <Link href={file.url} target="_blank" rel="noopener noreferrer">
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className="!size-20 pointer-events-none"
            imageClassName="!size-11"
          />
        </Link>
        <div className="flex flex-col items-end justify-between">
          <ActionDropdown file={file} currentUser={currentUser} />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>
      <div className="file-card-detaiPls">
        <p className="subtitle-2 line-clamp">{file.name}</p>
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">
          By: {file.owner.fullName}
        </p>
      </div>
    </div>
  );
};

export default Card;
