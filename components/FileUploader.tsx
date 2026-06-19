"use client";

import { cn } from "@/lib/utils";
import { type MouseEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";
import { getFileType } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import { convertFileToUrl } from "@/lib/utils";
import { toast } from "react-toastify";
import { MAX_FILE_SIZE } from "../constants/index";
import { usePathname } from "next/navigation";
import { uploadFiles } from "@/lib/actions/file.actions";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

//toast.warning("Job Added Successfully");
const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      console.log(acceptedFiles);
      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          );
          toast.error(
            <p className="body-2 text-red">
              <span className="font-semibold">{file.name}</span> is too large.
              Max size is 50MB.
            </p>,
          );
          return;
        }

        try {
          const uploadFile = await uploadFiles({
            file,
            ownerId,
            accountId,
            path,
          });

          if (uploadFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name),
            );
            return toast.success(
              <p className="body-2 subtitle-2">
                <span className="font-semibold">{file.name}</span> uploaded
                successfully.
              </p>,
              {
                position: "top-center",
              },
            );
          }
        } catch (error) {
          console.error("File upload failed:", error);
          toast.error(
            <p className="body-2 text-red">
              Failed to upload{" "}
              <span className="font-semibold">{file.name}</span>.
            </p>,
          );
        }
      });

      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path],
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: MouseEvent<HTMLImageElement>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };
  return (
    <div {...getRootProps()} className="cursor pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="Upload"
          width={24}
          height={24}
        />
        <p>upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    <span className="truncate block">{file.name}</span>
                    <div className="loader-track">
                      <div className="loader-progress" />
                    </div>
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return <div>FileUploader</div>;
};

export default FileUploader;
