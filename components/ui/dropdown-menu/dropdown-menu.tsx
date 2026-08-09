import React, { useContext, useEffect, useRef, useState } from "react";
import { Placement, useFloatingPosition } from "./use-floating-position";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";

type DropdownMenuType = React.HTMLAttributes<HTMLDivElement>;

interface DropdownMenuProps extends DropdownMenuType {
  spacing?: number;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hasOverlay?: boolean;
}

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

interface DropdownMenuSubContextType {
  open: boolean;
  setOpen: (value: boolean) => void;
  triggerRef_sub: React.RefObject<HTMLDivElement | null>;
}
const DropdownMenuSubContext =
  React.createContext<DropdownMenuSubContextType | null>(null);

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(
  null,
);

const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (!context)
    throw new Error("useDropdownMenu must be used within DropdownMenu");
  return context;
};

const useDropdownMenuSub = () => {
  const ctx = useContext(DropdownMenuSubContext);
  if (!ctx)
    throw new Error("useDropdownMenuSub must be used within DropdownMenuSub");
  return ctx;
};

export const DropdownMenu = ({
  children,
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const triggerRef = useRef<HTMLDivElement>(null);

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(value);
    }
    onOpenChange?.(value);
  };

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger = ({
  children,
  className,
  ...props
}: DropdownMenuProps) => {
  const { open, triggerRef, setOpen } = useDropdownMenu();

  return (
    <div
      ref={triggerRef}
      onClick={() => setOpen(!open)}
      className={cn("dropdown-menu-trigger", className ? className : "")}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({
  children,
  className,
  spacing = 8,
  placement = "bottom",
  hasOverlay,
  style,
  ...props
}: DropdownMenuProps) => {
  const { open, triggerRef, setOpen } = useDropdownMenu();
  const contentRef = useRef<HTMLDivElement>(null);

  const { position, hasPosition } = useFloatingPosition(
    open,
    triggerRef,
    contentRef,
    spacing,
    placement,
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !triggerRef.current?.contains(t) &&
        !contentRef.current?.contains(t)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [triggerRef, contentRef, setOpen]);

  if (!open) return null;

  return createPortal(
    <>
      {hasOverlay && (
        <div className="absolute inset-0 pointer-events-auto touch-manipulation z-9998 transition-[visibility_1ms_linear,opacity_1ms_linear] visible" />
      )}
      <div
        ref={contentRef}
        className={cn(
          "dropdown-menu-content rounded-md z-9999 max-h-[calc(100vh-40px)] min-w-32 overflow-y-auto border bg-popover p-1 text-popover-foreground shadow-md bg-background overflow-x-hidden overscroll-none [&::-webkit-scrollbar-thumb]:cursor-pointer [&::-webkit-scrollbar]:size-2 hover:[&::-webkit-scrollbar]:size-2 hover:[&::-webkit-scrollbar-thumb]:bg-scrollbar hover:[&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb:hover]:bg-scrollbar-hover",
          className,
        )}
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          opacity: hasPosition ? 1 : 0,
          visibility: hasPosition ? "visible" : "hidden",
          pointerEvents: hasPosition ? "auto" : "none",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </>,
    document.body,
  );
};

export const DropdownMenuLabel = ({
  children,
  className,
  ...props
}: DropdownMenuProps) => {
  return (
    <div
      className={cn(
        "dropdown-menu-label px-2 py-1.5 text-sm font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuSeparator = ({
  className,
  ...props
}: DropdownMenuProps) => {
  return (
    <div
      className={cn(
        "dropdown-menu-separator",
        className ? className : "-mx-1 my-1 h-px bg-dmenu",
      )}
      {...props}
    />
  );
};
export const DropdownMenuGroup = ({
  children,
  className,
  ...props
}: DropdownMenuProps) => {
  return (
    <div
      className={cn("dropdown-menu-group", className ? className : "")}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({
  children,
  className,
  onClick,
  ...props
}: DropdownMenuProps) => {
  const { setOpen } = useDropdownMenu();

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (typeof onClick === "function") onClick(e);
    setOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "dropdown-menu-item cursor-pointer relative flex items-center select-none hover:bg-btn-active gap-2 focus:bg-background rounded-sm outline-none transition-colors px-2 py-1.5 text-sm ",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuShortcut = ({
  children,
  className,
  ...props
}: DropdownMenuProps) => {
  return (
    <span
      className={cn(
        "dropdown-menu-shortcut ml-auto opacity-60 tracking-widest",
        className ? className : "pl-5 text-xs",
      )}
      {...props}
    >
      {children}
    </span>
  );
};
export const DropdownMenuSub = ({
  children,
  className,
  ...props
}: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef_sub = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };
  return (
    <DropdownMenuSubContext.Provider value={{ open, setOpen, triggerRef_sub }}>
      <div
        ref={triggerRef_sub}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </DropdownMenuSubContext.Provider>
  );
};
export const DropdownMenuSubTrigger = ({
  children,
  className,
  ...props
}: DropdownMenuProps) => {
  return (
    <div
      className={cn(
        "dropdown-menu-sub-trigger flex items-center justify-between cursor-pointer select-none rounded-sm hover:bg-hover-accent px-2 py-1.5 text-sm",
        className,
      )}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path d="m9 18 6-6-6-6"></path>
      </svg>
    </div>
  );
};
export const DropdownMenuPortal = ({
  children,
  className,
  spacing = 0,
  placement = "right",
  style,
  ...props
}: DropdownMenuProps) => {
  const { open, triggerRef_sub } = useDropdownMenuSub();
  const portalRef = useRef<HTMLDivElement>(null);

  const { position, hasPosition } = useFloatingPosition(
    open,
    triggerRef_sub,
    portalRef,
    spacing,
    placement,
  );
  if (!open) return null;

  return (
    <div
      ref={portalRef}
      className={cn(
        "dropdown-menu-portal rounded-md left-0 top-0",
        className ? className : "",
      )}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        opacity: hasPosition ? 1 : 0,
        visibility: hasPosition ? "visible" : "hidden",
        pointerEvents: hasPosition ? "auto" : "none",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuSubContent = ({
  children,
  className,
  ...props
}: DropdownMenuProps) => {
  return (
    <div
      className={cn(
        "dropdown-menu-sub-content z-50 min-w-32 overflow-hidden rounded-md bg-popover bg-background border p-1 shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
