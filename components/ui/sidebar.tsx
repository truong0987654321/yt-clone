"use client";

import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Tooltip } from "./tooltip";
import { Scrollbar } from "./scrollbar";

type BasicType = React.HTMLAttributes<HTMLDivElement>;
type LinkType = React.AnchorHTMLAttributes<HTMLAnchorElement>;

type SidebarPosition = "top" | "bottom" | "left" | "right";

interface SidebarContextProps extends BasicType {
  special?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed: (open: boolean) => void;
}
interface SidebarProps extends BasicType {
  collapsed?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
  special?: boolean;
}
interface SidebarItemProp extends LinkType {
  exact?: boolean;
  tooltip?: string;
  tooltipPosition?: SidebarPosition;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

function useSidebar(): SidebarContextProps {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error(
      "All Sidebar.* components must be placed inside <SidebarProvider>.",
    );
  }
  return ctx;
}

const SidebarRoot = ({
  collapsed,
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed,
  special = false,
  children,
  className,
  ...props
}: SidebarProps) => {
  const [internalIsCollapsed, internalSetIsCollapsed] = useState(
    collapsed ?? false,
  );

  const isCollapsed = externalIsCollapsed ?? internalIsCollapsed;

  const setIsCollapsed = externalSetIsCollapsed ?? internalSetIsCollapsed;
  useEffect(() => {
    const mobileMedia = window.matchMedia("(max-width: 57.438rem)");

    const desktopMedia = window.matchMedia("(min-width: 1275px)");

    const handleResize = () => {
      if (special) return;
      if (mobileMedia.matches) {
        setIsCollapsed(true);
      }

      if (desktopMedia.matches) {
        setIsCollapsed(false);
      }
    };

    handleResize();

    mobileMedia.addEventListener("change", handleResize);

    desktopMedia.addEventListener("change", handleResize);

    return () => {
      mobileMedia.removeEventListener("change", handleResize);

      desktopMedia.removeEventListener("change", handleResize);
    };
  }, [setIsCollapsed, special]);

  const value: SidebarContextProps = {
    isCollapsed,
    setIsCollapsed,
    special,
  };
  return (
    <SidebarContext.Provider value={value}>
      <div
        className={cn(
          "home grid max-h-screen min-h-screen grid-cols-[min-content_1fr_3.5rem] grid-rows-[min-content_1fr] [grid-template-areas:'sidebar_header_activity-bar''sidebar_main_activity-bar'] [&:not(:has(.activity-bar))]:grid-cols-[min-content_1fr] [&:not(:has(.activity-bar))]:[grid-template-areas:'sidebar_header''sidebar_main'] [&:not(:has(.header))]:grid-rows-[1fr] [&:not(:has(.header))]:[grid-template-areas:'sidebar_main_activity-bar'] [&:not(:has(.header)):not(:has(.activity-bar))]:grid-cols-[min-content_1fr] [&:not(:has(.header)):not(:has(.activity-bar))]:[grid-template-areas:'sidebar_main']",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

const SidebarTrigger = ({ children, className, ...props }: BasicType) => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const handleClick = async () => {
    const newState = !isCollapsed;
    setIsCollapsed?.(newState);
  };
  return (
    <div
      onClick={handleClick}
      className={cn("text-foreground [&>svg]:text-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const SidebarActivityBar = () => {
  return (
    <div className="activity-bar [grid-area:activity-bar]">
      SidebarActivityBar
    </div>
  );
};

const SidebarHeader = ({ children, className, ...props }: BasicType) => {
  return (
    <header className={cn("header [grid-area:header]", className)} {...props}>
      {children}
    </header>
  );
};

const SidebarMain = ({ children, className, ...props }: BasicType) => {
  return (
    <main
      className={cn(
        "main [grid-area:main] bg-background min-w-0 relative overflow-auto max-h-screen p-[0_1.5rem] [&::-webkit-scrollbar]:size-2 [&::-webkit-scrollbar-thumb]:bg-scrollbar [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb:hover]:bg-scrollbar-hover",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
};

const SidebarContent = ({ children, className, ...props }: BasicType) => {
  const { isCollapsed, setIsCollapsed, special } = useSidebar();
  const handleOverlayClick = () => {
    console.log("overlay clicked");
    if (special) {
      setIsCollapsed?.(false);
    } else {
      setIsCollapsed?.(true);
    }
  };
  return (
    <div
      className={cn(
        "sidebar [grid-area:sidebar] h-screen z-9999 sticky top-0 shadow-[1px_0_var(--color-sidebar-shadow-line)]",
        className,
      )}
      {...props}
    >
      {!special
        ? // Logic bình thường
          !isCollapsed && (
            <div
              onClick={handleOverlayClick}
              className="hidden max-[57.438rem]:block fixed h-screen w-full bg-[#0006]"
            />
          )
        : // Logic khi special =
          isCollapsed && (
            <div
              onClick={handleOverlayClick}
              className="fixed h-screen w-full bg-[#0006]"
            />
          )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};

const SidebarContainer = ({ children, className, ...props }: BasicType) => {
  const { isCollapsed, special } = useSidebar();
  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-background max-[57.438rem]:[&:not(.is-collapsed)]:shadow-[0px_4px_4px_0px_rgba(var(--color-elevation-shadow-rgb),.3),0px_8px_12px_6px_rgba(var(--theme-color-elevation-shadow-rgb),.15)] transition-[width_.3s_cubic-bezier(0.4,0,0.2,1)] duration-200 max-[57.438rem]:[&:not(.is-collapsed)]:ease-out max-[57.438rem]:[&:not(.is-collapsed)]:fixed max-[57.438rem]:[&.is-collapsed]:fixed max-[57.438rem]:[&.is-collapsed]:shadow-none max-[57.438rem]:[&.is-collapsed]:-translate-x-64 max-[57.438rem]:[&.is-collapsed]:ease-in group",
        special
          ? [isCollapsed ? "w-64 fixed" : "-translate-x-90 fixed ease-out"]
          : [isCollapsed ? "w-17 is-collapsed" : "w-64"],

        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// logo

const SidebarLogo = ({ children, className, ...props }: BasicType) => {
  return (
    <h2
      className={cn("border-r border-solid border-border", className)}
      {...props}
    >
      <Link href="/" target="_black">
        <div
          className={cn(
            "flex items-center border-b border-solid border-border text-foreground py-0 px-5 h-12 group-[.is-collapsed]:justify-center",
          )}
        >
          {children}
        </div>
      </Link>
    </h2>
  );
};

const SidebarLogoIcon = ({ children, className, ...props }: BasicType) => {
  return (
    <div
      className={cn(
        "fill-current normal-case tracking-[normal] whitespace-normal bg-no-repeat flex justify-center items-center size-6 overflow-hidden text-[1.4rem] relative",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const SidebarLogoText = ({ children, className, ...props }: BasicType) => {
  return (
    <span
      className={cn(
        "font-bold text-[1.5rem] ml-3 transition-[opacity_.3s_cubic-bezier(.4,0,.2,1)] group-[.is-collapsed]:hidden",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

const SidebarItemContainer = ({ children, className, ...props }: BasicType) => {
  const { isCollapsed, special } = useSidebar();
  return (
    <Scrollbar
      className={cn("flex flex-col grow justify-between", className)}
      size={special ? 2 : isCollapsed ? 1 : 2}
      {...props}
    >
      <div className={cn("py-0 px-1", isCollapsed && "py-0 px-0")}>
        {children}
      </div>
    </Scrollbar>
  );
};

// SidebarItemHighlight
const SidebarItemHighlight = ({ children, className, ...props }: BasicType) => {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 border-b border-solid border-border transition-[height_.3s_cubic-bezier(.4,0,.2,1),padding_.3s_cubic-bezier(.4,0,.2,1)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const SidebarItem = ({
  children,
  className,
  href,
  exact = false,
  tooltip,
  tooltipPosition = "right",
  ...props
}: SidebarItemProp) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href;
  const { isCollapsed, special } = useSidebar();

  const item = (
    <div className="w-auto block relative">
      <Link
        href={href ?? "/"}
        className={cn(
          isActive && "active",
          "text-foreground flex items-center h-8 text-[.875rem] font-medium leading-5 [text-decoration:none] transition-[background-color_.15s] rounded-2xl py-0 pr-10 pl-5 hover:bg-btn-hover hover:text-foreground-hover [&.active]:bg-btn-active [&.active]:text-foreground cursor-pointer group-[.is-collapsed]:justify-center group-[.is-collapsed]:p-0",
          className,
        )}
        {...props}
      >
        {children}
      </Link>
    </div>
  );

  if (special || !isCollapsed || !tooltip) {
    return item;
  }
  return (
    <Tooltip tooltip={tooltip} tooltipPosition={tooltipPosition}>
      <Tooltip.Trigger>{item}</Tooltip.Trigger>
      <Tooltip.Content className="bg-background-secondary after:bg-background-secondary text-foreground-secondary">
        {tooltip}
      </Tooltip.Content>
    </Tooltip>
  );
};

const SidebarItemContent = ({ children, className, ...props }: BasicType) => {
  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      {children}
    </div>
  );
};

const SidebarItemContentIcon = ({
  children,
  className,
  ...props
}: BasicType) => {
  return (
    <span
      className={cn(
        "fill-current normal-case tracking-[normal] whitespace-normal bg-no-repeat flex items-center justify-center not-italic overflow-hidden leading-4 text-inherit size-4",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

const SidebarItemContentLabel = ({
  children,
  className,
  ...props
}: BasicType) => {
  return (
    <div
      className={cn(
        "overflow-hidden text-ellipsis whitespace-nowrap transition-[opacity_.3s_cubic-bezier(.4,0,.2,1)] group-[.is-collapsed]:hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// SidebarItemTitle
const SidebarItemSection = ({ children, className, ...props }: BasicType) => {
  return (
    <div
      className={cn("border-b-0 flex flex-col gap-2 p-0", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const SidebarItemTitle = ({ children, className, ...props }: BasicType) => {
  return (
    <>
      <div
        className={cn(
          "text-[.75rem]/[1rem] font-normal text-foreground py-3.5 px-6 group-[.is-collapsed]:hidden",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

// SidebarToggleButton
const SidebarToggleButton = ({ children, className, ...props }: BasicType) => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const handleClick = () => {
    const newState = !isCollapsed;
    setIsCollapsed?.(newState);
  };
  return (
    <>
      <div className="border-border border-t m-[0_.625rem]" />
      <button
        className="bg-transparent py-2.5 px-6 flex flex-none items-center h-11 relative cursor-pointer"
        onClick={handleClick}
      >
        <div
          className={cn(
            "text-foreground absolute overflow-visible right-5.5 transition-[transform_.3s_cubic-bezier(.4,0,.2,1),color_.1s_cubic-bezier(.4,0,.2,1)] rotate-180 group-[.is-collapsed]:rotate-0",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </button>
    </>
  );
};

const SidebarToggleButtonIcon = ({
  children,
  className,
  ...props
}: BasicType) => {
  return (
    <span
      className={cn(
        "fill-current normal-case tracking-[normal] whitespace-normal bg-no-repeat flex items-center justify-center overflow-hidden not-italic text-inherit leading-4 size-4",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const Sidebar = Object.assign(SidebarRoot, {
  Trigger: SidebarTrigger,
  ActivityBar: SidebarActivityBar,
  Header: SidebarHeader,
  Main: SidebarMain,
  Content: SidebarContent,
  Container: SidebarContainer,
  Logo: SidebarLogo,
  LogoIcon: SidebarLogoIcon,
  LogoText: SidebarLogoText,
  ItemContainer: SidebarItemContainer,
  ItemHighlight: SidebarItemHighlight,
  Item: SidebarItem,
  ItemContent: SidebarItemContent,
  ItemContentIcon: SidebarItemContentIcon,
  ItemContentLabel: SidebarItemContentLabel,
  ItemSection: SidebarItemSection,
  ItemTitle: SidebarItemTitle,
  ToggleButton: SidebarToggleButton,
  ToggleButtonIcon: SidebarToggleButtonIcon,
});
