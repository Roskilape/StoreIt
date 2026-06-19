export const getDashboardWidgets = (files: FileDocument[]) => {
  return [
    {
      name: "Documents",
      icon: "/assets/icons/file-document-light.svg",
      url: "/documents",
      size: files
        .filter((file) => file.type === "document")
        .reduce((total, file) => total + file.size, 0),
      lastUpdated: () => {
        const documentFiles = files.filter((file) => file.type === "document");

        if (documentFiles.length === 0) return null;

        return documentFiles.sort(
          (a, b) =>
            new Date(b.$updatedAt).getTime() - new Date(a.$updatedAt).getTime(),
        )[0].$updatedAt;
      },
    },

    {
      name: "Images",
      icon: "/assets/icons/file-image-light.svg",
      url: "/images",
      size: files
        .filter((file) => file.type === "images")
        .reduce((total, file) => total + file.size, 0),
      lastUpdated: () => {
        const documentFiles = files.filter((file) => file.type === "images");

        if (documentFiles.length === 0) return null;

        return documentFiles.sort(
          (a, b) =>
            new Date(b.$updatedAt).getTime() - new Date(a.$updatedAt).getTime(),
        )[0].$updatedAt;
      },
    },

    {
      name: "Video, Audio",
      icon: "/assets/icons/file-video-light.svg",
      url: "/media",
      size: files
        .filter((file) => file.type === "video" || file.type === "audio")
        .reduce((total, file) => total + file.size, 0),
      lastUpdated: () => {
        const documentFiles = files.filter(
          (file) => file.type === "video" || file.type === "audio",
        );

        if (documentFiles.length === 0) return null;

        return documentFiles.sort(
          (a, b) =>
            new Date(b.$updatedAt).getTime() - new Date(a.$updatedAt).getTime(),
        )[0].$updatedAt;
      },
    },

    {
      name: "Others",
      icon: "/assets/icons/file-other-light.svg",
      url: "/others",
      size: files
        .filter((file) => file.type === "other")
        .reduce((total, file) => total + file.size, 0),
      lastUpdated: () => {
        const documentFiles = files.filter((file) => file.type === "document");

        if (documentFiles.length === 0) return null;

        return documentFiles.sort(
          (a, b) =>
            new Date(b.$updatedAt).getTime() - new Date(a.$updatedAt).getTime(),
        )[0].$updatedAt;
      },
    },
  ];
};

import { getFiles } from "@/lib/actions/file.actions";

export const getUserStorageUsed = async () => {
  const files = await getFiles({});

  return files.documents.reduce(
    (total: number, file: FileDocument) => total + file.size,
    0,
  );
};
