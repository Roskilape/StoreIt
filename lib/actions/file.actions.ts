"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { handleError } from "../utils";
import { appwriteConfig } from "../appwrite/config";
import { ID, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { getCurrentUser } from "./user.action";
import { getUserStorageUsed } from "@/constants/getDashboardWidgets";

export const uploadFiles = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  console.log("Uploading file:", file.name, "Size:", file.size);

  try {
    const MB = 1024 * 1024;
    const TOTAL_STORAGE = 100 * MB;

    const userStorageUsed = await getUserStorageUsed();

    const userAvailableStorage = TOTAL_STORAGE - userStorageUsed;
    if (file.size > userAvailableStorage) {
      console.error("not enough Space");
      return;
    } else {
      const inputFile = InputFile.fromBuffer(file, file.name);

      console.log(file);
      const bucketFile = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        inputFile,
      );
      const fileDocument = {
        type: getFileType(file.name).type,
        name: bucketFile.name,
        url: constructFileUrl(bucketFile.$id),
        extension: getFileType(file.name).extension,
        size: bucketFile.sizeOriginal,
        owner: ownerId,
        users: [],
        accountId,
        bucketFileId: bucketFile.$id,
      };
      console.log(getFileType(file.name));
      console.log(fileDocument.type);
      let newFile: unknown;
      try {
        newFile = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.fileCollectionId,
          ID.unique(),
          fileDocument,
        );

        revalidatePath(path);
      } catch (error) {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        throw error;
      }
      return parseStringify(newFile);
    }
  } catch (error) {
    unstable_rethrow(error);
    handleError(error, "Failed to Upload file");
  }
};

interface Props {
  $id: string;
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
}

const createQueries = (
  currentUser: Props,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number,
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
    Query.select(["*", "owner.*"]),
  ];
  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");
    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
    );
  }
  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("User not found");
    }

    const queries = createQueries(currentUser, types, searchText, sort, limit);

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      queries,
    );

    return parseStringify(files);
  } catch (error) {
    unstable_rethrow(error);
    handleError(error, "Failed to fetch files");
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      { name: newName },
    );
    revalidatePath(path);
    return parseStringify({ updatedFile });
  } catch (error) {
    console.log(error, "failed to rename");
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,

  path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      { users: emails },
    );
    revalidatePath(path);
    return parseStringify({ updatedFile });
  } catch (error) {
    console.log(error, "failed to update the users email");
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();

  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId,
    );

    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }
    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    console.log(error, "failed to update the users email");
  }
};
