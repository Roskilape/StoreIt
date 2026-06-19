"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/dist/client/components/navigation";
import Image from "next/image";
import { useState } from "react";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { navItems } from "../constants/index";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.action";

interface props {
  avatar: string;
  fullName: string;
  email: string;
  $Id: string;
  accountId: string;
}

const MobileNavigation = ({
  avatar,
  fullName,
  email,
  $Id: ownerId,
  accountId,
}: props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="mobile-header">
      <Image
        src="assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="assets/icons/menu.svg"
            alt="Search"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3 bg-white/90 backdrop-blur-sm lg:hidden">
          <SheetTitle>
            {" "}
            <div className="header-user">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
            </div>
            <div className="sm:hidden lg:block ">
              <p className="subtitle-2 capitalize">{fullName}</p>
              <p className="caption">{email}</p>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>
          <nav className="sidebar-nav">
            {navItems.map(({ url, name, icon }) => (
              <Link href={url} key={name} className="lg:w-full">
                <li
                  className={cn(
                    "mobile-nav-item",
                    pathname === url && "shad-active",
                  )}
                >
                  {" "}
                  <Image
                    src={icon}
                    alt={name}
                    width={24}
                    height={24}
                    className={cn(
                      "nav-icon",
                      pathname === url && "nav-icon-active",
                    )}
                  />
                  <p className="block">{name}</p>
                </li>
              </Link>
            ))}
          </nav>
          <Separator className="my-5 bg-light-200/20" />

          <div className="flex flex-col justify-between gap-5">
            <FileUploader ownerId={ownerId} accountId={accountId} />
          </div>

          <Button
            type="submit"
            className="mobile-sign-out-button"
            onClick={async () => await signOutUser()}
          >
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
            />
            <p>Log Out</p>
          </Button>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
