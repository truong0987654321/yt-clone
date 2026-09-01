"use client";

import { usePathname } from "next/navigation";
import { Scrollbar } from "./ui/scrollbar";
import { PAGES } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

const items = [
  {
    name: "Account",
    link: PAGES.ACCOUNT,
  },
  {
    name: "Advanced settings",
    link: PAGES.ACCOUNT_ADVANCED,
  },
];

export const SettingSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 h-[calc(100vh-56px)] flex flex-col w-64 box-border p-[18px_0]">
      <div className="title text-foreground-tertiary pl-6 text-[18px] leading-[2.6rem] font-bold">
        Settings
      </div>
      <Scrollbar className="items" size={2}>
        {items.map((item) => {
          const isActive = pathname === item.link;

          return (
            <div
              key={item.link}
              className={cn(
                "group block mx-2 my-0 [&.active]:bg-btn-active [&.active]:rounded-lg hover:bg-btn-active",
                isActive && "active",
              )}
            >
              <Link
                href={item.link}
                className="block cursor-pointer decoration-0 text-foreground"
              >
                <div className="flex items-center flex-row text-[16px] font-normal leading-6 min-h-10 px-4 py-0 h-10 whitespace-nowrap group-[.active]:font-semibold group-[.active]:text-[14px]">
                  {item.name}
                </div>
              </Link>
            </div>
          );
        })}
      </Scrollbar>
    </div>
  );
};
