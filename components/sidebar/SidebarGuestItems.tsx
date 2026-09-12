"use client";

import { Sidebar } from "../ui/sidebar";
import {
  History,
  Home,
  LikedVideo,
  Playlist,
  Short,
  Subscription,
} from "../icons/Icon";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { ChevronRight } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ButtonLogin } from "../Button";
import { useI18n } from "@/i18n/context";
interface SidebarGuestItemsProps {
  isCollapsed: boolean;
}

interface SectionItem {
  href: string;
  label: string;
  tooltip: string;
  icon?: React.ReactNode;
}

interface SidebarGuestItemSectionProps {
  id: string;
  title?: React.ReactNode;
  items: SectionItem[];
  isCollapsed: boolean;
}

const getSidebarItems = (t: ReturnType<typeof useI18n>["t"]) => ({
  highlight: [
    {
      href: "/",
      label: t("sidebar.home"),
      tooltip: t("sidebar.home"),
      icon: <Home className="size-6" />,
    },
    {
      href: "/shorts",
      label: t("sidebar.shorts"),
      tooltip: t("sidebar.shorts"),
      icon: <Short className="size-6" />,
    },
    {
      href: "/feed/subscriptions",
      label: t("sidebar.subscriptions"),
      tooltip: t("sidebar.subscriptions"),
      icon: <Subscription className="size-6" />,
    },
  ],

  sections: [
    {
      id: "1",
      title: (
        <Link
          href="/feed/you"
          className="flex flex-row items-center gap-2 h-10 px-6 rounded-[10px] text-[1rem] hover:bg-btn-hover"
        >
          {t("sidebar.you")}
          <ChevronRight className="size-4" />
        </Link>
      ),
      items: [
        {
          href: "/feed/history",
          label: t("sidebar.history"),
          tooltip: t("sidebar.history"),
          icon: <History className="size-4" />,
        },
        {
          href: "/feed/playlists",
          label: t("sidebar.playlists"),
          tooltip: t("sidebar.playlists"),
          icon: <Playlist className="size-4" />,
        },
        {
          href: "/feed/playlist?list=LL",
          label: t("sidebar.likedVideos"),
          tooltip: t("sidebar.likedVideos"),
          icon: <LikedVideo className="size-4" />,
        },
      ],
    },
  ],
});

export const SidebarGuestItems = ({ isCollapsed }: SidebarGuestItemsProps) => {
  const { t } = useI18n();
  const sidebarItems = getSidebarItems(t);
  const { data: user } = useCurrentUser();

  return (
    <>
      {sidebarItems.highlight.length > 0 && (
        <Sidebar.ItemHighlight
          className={cn("border-none p-3", isCollapsed ? "" : "gap-0")}
        >
          {sidebarItems.highlight.map((item) => (
            <Sidebar.Item
              key={item.label}
              href={item.href}
              tooltip={item.tooltip}
              className="h-10 rounded-[10px] group"
            >
              <Sidebar.ItemContent>
                <Sidebar.ItemContentIcon className="in-[.active]:[&_path]:fill-foreground size-6 in-[:not(.active)]:[&_svg]:stroke-2">
                  {item.icon}
                </Sidebar.ItemContentIcon>

                <Sidebar.ItemContentLabel>
                  {item.label}
                </Sidebar.ItemContentLabel>
              </Sidebar.ItemContent>
            </Sidebar.Item>
          ))}
        </Sidebar.ItemHighlight>
      )}
      {user ? (
        <>
          {sidebarItems.sections.map((section) => (
            <SidebarGuestItemSection
              key={section.id}
              id={section.id}
              title={section.title}
              items={section.items}
              isCollapsed={isCollapsed}
            />
          ))}
        </>
      ) : (
        <SidebarSignInSection isCollapsed={isCollapsed} />
      )}
    </>
  );
};

const SidebarGuestItemSection = ({
  id,
  title,
  items,
  isCollapsed,
}: SidebarGuestItemSectionProps) => {
  return (
    <Sidebar.ItemSection
      key={id}
      className={cn("border-t border-border p-3", isCollapsed ? "" : "gap-0")}
    >
      {title ? (
        <Sidebar.ItemTitle className="p-0">{title}</Sidebar.ItemTitle>
      ) : null}
      {items.map((item) => (
        <Sidebar.Item
          key={item.href}
          href={item.href}
          tooltip={item.tooltip}
          className="h-10 rounded-[10px] group"
        >
          <Sidebar.ItemContent>
            {item.icon ? (
              <Sidebar.ItemContentIcon className="size-6">
                {item.icon}
              </Sidebar.ItemContentIcon>
            ) : null}
            <Sidebar.ItemContentLabel>{item.label}</Sidebar.ItemContentLabel>
          </Sidebar.ItemContent>
        </Sidebar.Item>
      ))}
    </Sidebar.ItemSection>
  );
};

const SidebarSignInSection = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { t } = useI18n();

  const { isLoading } = useCurrentUser();

  if (isLoading) return null;

  return (
    <div
      className={cn(
        "p-3 border-t border-border py-4",
        isCollapsed ? "hidden" : "block",
      )}
    >
      <div className="pl-5">
        <div className="text-[.875rem] leading-5">
          {t("sidebar.noteSignIn")}
        </div>
        <div className="mt-3">
          <ButtonLogin />
        </div>
      </div>
    </div>
  );
};
