"use client";

import Link from "next/link";
import { Sidebar } from "../ui/sidebar";
import Image from "next/image";
import { ButtonIcon } from "../ui/button";
import { useEffect, useState } from "react";
import { UserButton } from "../UserButton";
import { SearchInput } from "./SearchInput";
import { ArrowLeft, Menu } from "lucide-react";
import { ClientOnly } from "../providers/ClientOnly";

export const HomeNavbar = () => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 656) {
        setActive(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // check lần đầu
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className="transform-[translateY(0)] transition-[transform_.3s_cubic-bezier(.05,0,0,1)] group"
      {...(active && { "data-active": "" })}
    >
      <div className="h-14 bg-background flex items-center px-4 py-0 flex-row justify-between">
        {/* Menu and logo */}
        <div className="flex items-center shrink-0 ">
          <div className="mr-2 hidden group-data-active:flex">
            <ButtonIcon
              className="[&_span:first-child]:bg-background [&_span:first-child]:group-hover/button:before:bg-btn [&_span:first-child]:group-hover/button:before:opacity-100 *:text-foreground"
              sizeIcon="size-6"
              onClick={() => setActive(false)}
            >
              <ArrowLeft />
            </ButtonIcon>
          </div>
          <Sidebar.Trigger className="group-data-active:hidden">
            <ButtonIcon
              className="[&_span:first-child]:bg-background [&_span:first-child]:group-hover/button:before:bg-btn-hover [&_span:first-child]:group-hover/button:before:opacity-100 *:text-foreground"
              sizeIcon="size-6"
            >
              <Menu />
            </ButtonIcon>
          </Sidebar.Trigger>
          <Link href={"/"} className="group-data-active:hidden">
            <div className="p-4 flex items-center gap-1">
              <Image
                src="logo.svg"
                alt="logo"
                width={32}
                height={32}
                className="size-8"
                loading="eager"
              />
              <p>YoutubeCL</p>
            </div>
          </Link>
        </div>
        {/* Search bar */}
        <div className="flex-[0_1_732px] min-w-0 flex items-center flex-row max-[656px]:justify-end">
          <SearchInput active={active} setActive={() => setActive(true)} />
        </div>
        {/* User and Notification */}
        <div className="flex flex-row flex-none max-w-56.25 items-center justify-end max-[656px]:min-w-0 group-data-active:hidden">
          <ClientOnly
            fallback={
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            }
          >
            <UserButton />
          </ClientOnly>
        </div>
      </div>
    </div>
  );
};
