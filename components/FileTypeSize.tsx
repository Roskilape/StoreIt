import { convertFileSize } from "@/lib/utils";

const FileTypeSize = ({ files }: { files: FileDocument[] }) => {
  const totalFileSize = files.reduce((total, file) => total + file.size, 0);
  return (
    <p className="body-1">
      Total: &nbsp;
      <span className="h5">{convertFileSize(totalFileSize)}</span>
    </p>
  );
};

export default FileTypeSize;
