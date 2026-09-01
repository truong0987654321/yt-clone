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

const sidebarItems = {
  highlight: [
    {
      href: "/",
      label: "Home",
      tooltip: "Home",
      icon: <Home className="size-6" />,
    },
    {
      href: "/shorts",
      label: "Shorts",
      tooltip: "Shorts",
      icon: <Short className="size-6" />,
    },
    {
      href: "/feed/subscriptions",
      label: "Subscriptions",
      tooltip: "Subscriptions",
      icon: <Subscription className="size-6" />,
    },
  ],

  sections: [
    {
      id: "1",
      title: (
        <Link
          href={"/feed/you"}
          className="flex flex-row items-center text-[1rem] gap-2 hover:bg-btn-hover h-10 px-6 rounded-[10px]"
        >
          You <ChevronRight className="size-4" />
        </Link>
      ),
      items: [
        {
          href: "feed/history",
          label: "History",
          tooltip: "History",
          icon: <History className="size-4" />,
        },
        {
          href: "feed/playlists",
          label: "Playlists",
          tooltip: "Playlists",
          icon: <Playlist className="size-4" />,
        },
        {
          href: "feed/playlist?list=LL",
          label: "Liked videos",
          tooltip: "Liked videos",
          icon: <LikedVideo className="size-4" />,
        },
      ],
    },
  ],
};

export const SidebarGuestItems = ({ isCollapsed }: SidebarGuestItemsProps) => {
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
          Sign in to like videos, comment and subscribe.
        </div>
        <div className="mt-3">
          <ButtonLogin />
        </div>
      </div>
    </div>
  );
};
