"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify, handleError } from "../utils";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    return handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar:
          "data:image/png;base64,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",
        accountId,
      },
    );
  }

  return { accountId };
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    return handleError(error, "failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", result.$id)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    unstable_rethrow(error);
    console.error("Failed to get current user", error);
    return null;
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    // Log out from the current session
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    // Redirect to the login page after signing out
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      const accountId = await sendEmailOTP({ email });
      return { accountId };
    } else {
      return null;
    }
  } catch (error) {
    return handleError(error, "user not found");
  }
};
