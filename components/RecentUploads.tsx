"use client";

import Thumbnail from "./Thumbnail";

import ActionDropdown from "./ActionDropdown";
import { useRouter } from "next/navigation";
import FormattedDateTime from "./FormattedDateTime";

interface props {
  $id: string;
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
}

const RecentUploads = ({
  files,
  currentUser,
}: {
  files: FileDocument[];
  currentUser: props;
}) => {
  const router = useRouter();
  const recentFiles = files
    .sort(
      (a, b) =>
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime(),
    )
    .slice(0, 8);

  const handleClickItem = (file: FileDocument) => {
    router.push(
      `/${
        file.type === "video" || file.type === "audio" ? "media" : file.type
      }?selected=${file.$id}`,
    );
  };

  return (
    <div className="dashboard-recent-files">
      <div className="flex flex-col gap-y-4">
        <h1 className="h2">Recent files uploaded </h1>
        {recentFiles.length === 0 ? (
          <li className="subtitle-2">No files Uploaded</li>
        ) : (
          recentFiles.map((file) => (
            <li
              key={file.$id}
              className="recent-file-details cursor-pointer"
              onClick={() => {
                handleClickItem(file);
              }}
            >
              <div className="flex items-center gap-3">
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                  className="size-9 min-w-9"
                />
                <div className="flex flex-col items-start">
                  <p className="recent-file-name">{file.name}</p>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="recent-file-date"
                  />
                </div>
              </div>
              <ActionDropdown file={file} currentUser={currentUser} />
            </li>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentUploads;
