import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";

type BasicType = React.HTMLAttributes<HTMLDivElement>;

interface DropdownMenuProps extends BasicType {
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

function useDropdownMenu(): DropdownMenuContextType {
  const context = useContext(DropdownMenuContext);
  if (!context)
    throw new Error(
      "All DropdownMenu.* components must be placed inside <DropdownMenu>.",
    );
  return context;
}

function useDropdownMenuSub(): DropdownMenuSubContextType {
  const ctx = useContext(DropdownMenuSubContext);
  if (!ctx)
    throw new Error(
      "All DropdownMenuSub.* components must be placed inside <DropdownMenuSub>.",
    );
  return ctx;
}

type Position = { x: number; y: number };
export type Placement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

function useFloatingPosition(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  spacing = 8,
  placement: Placement = "bottom",
): { position: Position; hasPosition: boolean } {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [hasPosition, setHasPosition] = useState(false);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const triggerEl = triggerRef.current!;
      const triggerRect = triggerEl.getBoundingClientRect();
      const contentEl = contentRef.current;
      if (!contentEl) return;

      const contentHeight = contentEl.offsetHeight;
      const contentWidth = contentEl.offsetWidth;

      let x = triggerRect.left;
      let y = triggerRect.top;

      switch (placement) {
        case "bottom":
          x = triggerRect.left;
          y = triggerRect.bottom + spacing;
          if (y + contentHeight > window.innerHeight) {
            y = Math.max(triggerRect.top - contentHeight - spacing, spacing);
          }
          break;

        case "top":
          x = triggerRect.left;
          y = triggerRect.top - contentHeight - spacing;
          if (y < spacing) {
            y = Math.min(
              triggerRect.bottom + spacing,
              window.innerHeight - contentHeight - spacing,
            );
          }
          break;

        case "right":
          x = triggerRect.right + spacing;
          y = triggerRect.top;
          if (x + contentWidth > window.innerWidth) {
            x = Math.max(triggerRect.left - contentWidth - spacing, spacing);
          }
          break;

        case "left":
          x = triggerRect.left - contentWidth - spacing;
          y = triggerRect.top;
          if (x < spacing) {
            x = Math.min(
              triggerRect.right + spacing,
              window.innerWidth - contentWidth - spacing,
            );
          }
          break;
        case "bottom-left":
          x = triggerRect.right - contentWidth; // align phải với trigger
          y = triggerRect.bottom + spacing;
          if (y + contentHeight > window.innerHeight) {
            y = Math.max(triggerRect.top - contentHeight - spacing, spacing);
          }
          break;

        case "bottom-right":
          x = triggerRect.left; // align trái với trigger
          y = triggerRect.bottom + spacing;
          if (y + contentHeight > window.innerHeight) {
            y = Math.max(triggerRect.top - contentHeight - spacing, spacing);
          }
          break;

        case "top-left":
          x = triggerRect.right - contentWidth; // align phải với trigger
          y = triggerRect.top - contentHeight - spacing;
          if (y < spacing) {
            y = Math.min(
              triggerRect.bottom + spacing,
              window.innerHeight - contentHeight - spacing,
            );
          }
          break;

        case "top-right":
          x = triggerRect.left; // align trái với trigger
          y = triggerRect.top - contentHeight - spacing;
          if (y < spacing) {
            y = Math.min(
              triggerRect.bottom + spacing,
              window.innerHeight - contentHeight - spacing,
            );
          }
          break;
      }

      if (x + contentWidth > window.innerWidth - spacing) {
        x = window.innerWidth - contentWidth - spacing;
      }
      if (x < spacing) x = spacing;

      if (y + contentHeight > window.innerHeight - spacing) {
        y = window.innerHeight - contentHeight - spacing;
      }
      if (y < spacing) y = spacing;

      setPosition({ x, y });
      setHasPosition(true);
    };

    requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, triggerRef, contentRef, spacing, placement]);

  return { position, hasPosition };
}

const DropdownMenuRoot = ({
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

  const value: DropdownMenuContextType = {
    open,
    setOpen,
    triggerRef,
  };

  return (
    <DropdownMenuContext.Provider value={value}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = ({
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

const DropdownMenuContent = ({
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
          "dropdown-menu-content rounded-md z-9999 min-w-32 border bg-popover p-1 shadow-md bg-background-secondary max-h-[calc(100vh-10px)] overflow-hidden flex flex-col",
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

const DropdownMenuLabel = ({
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

const DropdownMenuSeparator = ({ className, ...props }: DropdownMenuProps) => {
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

const DropdownMenuGroup = ({
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

const DropdownMenuItem = ({
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

const DropdownMenuShortcut = ({
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
const DropdownMenuSub = ({
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

  const value: DropdownMenuSubContextType = {
    open,
    setOpen,
    triggerRef_sub,
  };

  return (
    <DropdownMenuSubContext.Provider value={value}>
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
const DropdownMenuSubTrigger = ({
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
const DropdownMenuPortal = ({
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

const DropdownMenuSubContent = ({
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

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Group: DropdownMenuGroup,
  Item: DropdownMenuItem,
  Shortcut: DropdownMenuShortcut,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  Protal: DropdownMenuPortal,
  SubContent: DropdownMenuSubContent,
});
