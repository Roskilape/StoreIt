"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  renameFile,
  updateFileUsers,
  deleteFile,
} from "@/lib/actions/file.actions";
import { FileDetails, ShareInput } from "./ActionsModalContent";

interface props {
  $id: string;
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
}

const ActionDropdown = ({
  file,
  currentUser,
}: {
  file: FileDocument;
  currentUser: props;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsloading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    // setEmails([])
  };

  const handleAction = async () => {
    if (!action) return;
    setIsloading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),

      share: () => updateFileUsers({ fileId: file.$id, emails, path }),
      delete: () =>
        deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path }),
    };
    success = await actions[action.value as keyof typeof actions]();

    if (success) closeAllModals();
    setIsloading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });
    if (success) setEmails(updatedEmails);
    closeAllModals();
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { label, value } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
              currentUser={currentUser}
            />
          )}

          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete {``}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter>
            <Button
              onClick={handleAction}
              className="bg-brand rounded-xl text-white text-center px-4 py-2"
            >
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={20}
                  height={21}
                  className="animate-spin"
                />
              )}
            </Button>
            <Button onClick={closeAllModals}> Cancel</Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild className="shad-no-focus">
          <Button variant="default">
            <Image
              src="/assets/icons/dots.svg"
              alt="dots"
              width={34}
              height={34}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="max-w-[200px] truncate">
              {file.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {actionsDropdownItems.map((actionItem) => (
              <DropdownMenuItem
                key={actionItem.value}
                className="shad-dropdown"
                onClick={() => {
                  setAction(actionItem);
                  if (
                    ["rename", "share", "delete", "details"].includes(
                      actionItem.value,
                    )
                  ) {
                    setIsModalOpen(true);
                  }
                }}
              >
                {actionItem.value === "download" ? (
                  <Link
                    href={constructDownloadUrl(file.bucketFileId)}
                    download={file.name}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
