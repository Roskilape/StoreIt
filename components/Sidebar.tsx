"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems, UserAvatar } from "../constants/index";
import { cn } from "@/lib/utils";

interface props {
  fullName: string;
  email: string;
  avatar: string;
}

const Sidebar = ({ fullName, email, avatar }: props) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="home"
          width={160}
          height={50}
          className="hidden h-auto w-auto lg:block"
        />

        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>
      <nav className="sidebar-nav">
        {navItems.map(({ url, name, icon }) => (
          <Link href={url} key={name} className="lg:w-full">
            <li
              className={cn(
                "sidebar-nav-item",
                pathname === url && "shad-active",
              )}
            >
              {" "}
              <Image
                src={icon}
                alt={name}
                width={24}
                height={25}
                className={cn(
                  "nav-icon",
                  pathname === url && "nav-icon-active",
                )}
              />
              <p className="hidden lg:block">{name}</p>
            </li>
          </Link>
        ))}
      </nav>
      .
      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />
      <div className="sidebar-user-info">
        <Image
          src={avatar || UserAvatar}
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />

        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
