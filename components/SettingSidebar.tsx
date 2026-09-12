"use client";

import { usePathname } from "next/navigation";
import { Scrollbar } from "./ui/scrollbar";
import { PAGES } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { useI18n } from "@/i18n/context";

const getitems = (t: ReturnType<typeof useI18n>["t"]) => [
  {
    name: t("advancedSettings.account"),
    link: PAGES.ACCOUNT,
  },
  {
    name: t("advancedSettings.title"),
    link: PAGES.ACCOUNT_ADVANCED,
  },
];
export const SettingSidebar = () => {
  const pathname = usePathname();
  const { t } = useI18n();

  const items = getitems(t);

  return (
    <div className="fixed left-0 h-[calc(100vh-56px)] flex flex-col w-64 box-border p-[18px_0]">
      <div className="title text-foreground-tertiary pl-6 text-[18px] leading-[2.6rem] font-bold">
        {t("settings.title")}
      </div>
      <Scrollbar className="items" size={2}>
        {items.map((item) => {
          const isActive = pathname === item.link;

          return (
            <div
              key={item.link}
              className={cn(
                "group block mx-2 [&.active]:bg-btn-active [&.active]:rounded-lg hover:bg-btn-active hover:rounded-lg",
                isActive && "active",
              )}
            >
              <Link
                href={item.link}
                className="block cursor-pointer decoration-0 text-foreground"
              >
                <div className="flex items-center flex-row text-base font-normal min-h-10 px-4 py-0 h-10 whitespace-nowrap group-[.active]:font-semibold group-[.active]:text-sm">
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
