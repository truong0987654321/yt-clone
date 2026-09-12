import { cn } from "@/lib/utils/cn";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  HTMLAttributes,
} from "react";

type Placement = "top" | "bottom" | "left" | "right" | "custom";

type BaseType = HTMLAttributes<HTMLDivElement>;

interface HoverCardContextValue {
  open: boolean;
  handleEnter: () => void;
  handleLeave: () => void;
  placement: Placement;
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

function useHoverCardContext() {
  const ctx = useContext(HoverCardContext);
  if (!ctx) {
    throw new Error(`HoverCard này phải được đặt bên trong <HoverCard>`);
  }
  return ctx;
}

interface HoverCardProps extends BaseType {
  placement?: Placement;
  /** Độ trễ (ms) trước khi hiện, tránh hiện ngay khi rê chuột qua nhanh */
  openDelay?: number;
  /** Độ trễ (ms) trước khi ẩn sau khi rời chuột */
  closeDelay?: number;
}

const HoverCardRoot = ({
  children,
  placement = "top",
  openDelay = 100,
  closeDelay = 150,
  className = "",
  ...props
}: HoverCardProps) => {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const handleEnter = () => {
    clearTimers();
    openTimer.current = setTimeout(() => setOpen(true), openDelay);
  };

  const handleLeave = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  useEffect(() => clearTimers, []);

  return (
    <HoverCardContext.Provider
      value={{ open, handleEnter, handleLeave, placement }}
    >
      <div
        className={cn("relative", className)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        {...props}
      >
        {children}
      </div>
    </HoverCardContext.Provider>
  );
};

const placementStyles: Partial<Record<Placement, string>> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Partial<Record<Placement, string>> = {
  top: "top-full left-1/2 -translate-x-1/2 -mt-1 border-t-white border-l-transparent border-r-transparent border-b-transparent",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-white border-l-transparent border-r-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 -ml-1 border-l-white border-t-transparent border-b-transparent border-r-transparent",
  right:
    "right-full top-1/2 -translate-y-1/2 -mr-1 border-r-white border-t-transparent border-b-transparent border-l-transparent",
};

const HoverCardContent = ({ children, className, ...props }: BaseType) => {
  const { open, placement } = useHoverCardContext();

  if (!open) return null;

  const isCustom = placement === "custom";

  return (
    <div
      role="tooltip"
      className={cn(
        isCustom
          ? "absolute z-50"
          : "absolute z-50 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg",
        "transition-opacity duration-150 ease-out",
        placementStyles[placement] ?? "",
        className,
      )}
      {...props}
    >
      {children}
      {!isCustom && (
        <div
          className={cn("absolute h-0 w-0 border-4", arrowStyles[placement])}
        />
      )}
    </div>
  );
};

export const HoverCard = Object.assign(HoverCardRoot, {
  Content: HoverCardContent,
});
