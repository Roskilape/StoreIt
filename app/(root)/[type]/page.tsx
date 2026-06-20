import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";

import Card from "@/components/Card";
import { getCurrentUser } from "@/lib/actions/user.action";
import { getFileTypesParams } from "@/lib/utils";
import FileTypeSize from "@/components/FileTypeSize";

const page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";
  const currentUser = await getCurrentUser();
  const selectedId = ((await searchParams)?.selected as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  const files = await getFiles({ types, searchText, sort });
  console.log(files);
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <FileTypeSize files={files.documents} />
          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>
      <br />
      {/* Render the files */}
      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: FileDocument) => (
            <Card
              key={file.$id}
              file={file}
              currentUser={currentUser}
              selectedFile={selectedId === file.$id}
            />
          ))}
        </section>
      ) : (
        <p className="empty-list">Files not Found</p>
      )}
    </div>
  );
};

export default page;
