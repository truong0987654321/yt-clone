"use client";

import { cn } from "@/lib/utils/cn";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type BasicType = React.HTMLAttributes<HTMLDivElement>;

interface TooltipContextProps {
  tooltip?: string;
  tooltipPosition: TooltipPosition;
  gap: number;
  showTooltip: boolean;
  setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
}

interface TooltipProps extends BasicType {
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  gap?: number;
}

const TooltipContext = createContext<TooltipContextProps | undefined>(
  undefined,
);
function useTooltip(): TooltipContextProps {
  const ctx = useContext(TooltipContext);

  if (!ctx) {
    throw new Error(
      "All Tooltip.* components must be placed inside <Tooltip>.",
    );
  }

  return ctx;
}

const TooltipRoot = ({
  children,
  className,
  tooltip,
  tooltipPosition = "top",
  gap = 8,
  ...props
}: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const value: TooltipContextProps = {
    tooltip,
    tooltipPosition,
    gap,
    showTooltip,
    setShowTooltip,
    tooltipRef,
  };
  return (
    <TooltipContext.Provider value={value}>
      <div className={cn("relative", className)} {...props}>
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = ({ children, className, ...props }: BasicType) => {
  const { setShowTooltip, tooltipRef } = useTooltip();

  return (
    <div
      ref={tooltipRef}
      className={cn("truncate w-auto", className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      {...props}
    >
      {children}
    </div>
  );
};

const getTooltipPositionStyle = (
  triggerRef: React.RefObject<HTMLDivElement | null>,
  tooltipEl: HTMLDivElement | null,
  tooltipPosition: TooltipPosition,
  gap: number,
) => {
  const rect = triggerRef.current?.getBoundingClientRect();

  if (!rect) return null;

  const ARROW_SIZE = 8;
  const SCREEN_PADDING = 8;

  const offset = gap + ARROW_SIZE / 2;

  const tooltipWidth = tooltipEl?.offsetWidth || 0;

  let style: React.CSSProperties = {};
  let arrowLeft = "50%";

  switch (tooltipPosition) {
    case "top":
      style = {
        top: rect.top - offset,
        left: rect.left + rect.width / 2,
        transform: "translate(-50%, -100%)",
      };
      break;

    case "bottom":
      style = {
        top: rect.bottom + offset,
        left: rect.left + rect.width / 2,
        transform: "translate(-50%, 0)",
      };
      break;

    case "left":
      style = {
        top: rect.top + rect.height / 2,
        left: rect.left - offset,
        transform: "translate(-100%, -50%)",
      };
      break;

    case "right":
      style = {
        top: rect.top + rect.height / 2,
        left: rect.right + offset,
        transform: "translate(0, -50%)",
      };
      break;
  }

  // Prevent overflow left/right
  if (tooltipPosition === "top" || tooltipPosition === "bottom") {
    let left = rect.left + rect.width / 2;

    const halfWidth = tooltipWidth / 2;

    // Left edge
    if (left - halfWidth < SCREEN_PADDING) {
      left = halfWidth + SCREEN_PADDING;
    }

    // Right edge
    if (left + halfWidth > window.innerWidth - SCREEN_PADDING) {
      left = window.innerWidth - halfWidth - SCREEN_PADDING;
    }

    style.left = left;

    // Arrow follow trigger
    const triggerCenter = rect.left + rect.width / 2;

    const arrowOffset = triggerCenter - left;

    arrowLeft = `calc(50% + ${arrowOffset}px)`;
  }

  return {
    style,
    arrowLeft,
  };
};

const TooltipContent = ({ children, className, ...props }: BasicType) => {
  const { tooltip, showTooltip, tooltipRef, tooltipPosition, gap } =
    useTooltip();

  const contentRef = useRef<HTMLDivElement | null>(null);

  const [positionStyle, setPositionStyle] =
    useState<React.CSSProperties | null>(null);

  const [arrowLeft, setArrowLeft] = useState<string>("50%");

  const calculatePosition = useCallback(() => {
    return getTooltipPositionStyle(
      tooltipRef,
      contentRef.current,
      tooltipPosition,
      gap,
    );
  }, [tooltipRef, tooltipPosition, gap]);

  useLayoutEffect(() => {
    if (!showTooltip) return;

    const result = calculatePosition();

    if (!result) return;
    setPositionStyle(result.style);
    setArrowLeft(result.arrowLeft);
  }, [showTooltip, calculatePosition]);

  useEffect(() => {
    if (!showTooltip) return;

    const handleUpdate = () => {
      const result = calculatePosition();

      if (!result) return;

      setPositionStyle(result.style);
      setArrowLeft(result.arrowLeft);
    };

    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);

      window.removeEventListener("resize", handleUpdate);
    };
  }, [showTooltip, calculatePosition]);

  if (!showTooltip || !positionStyle) return null;

  const getArrowClass = () => {
    switch (tooltipPosition) {
      case "top":
        return `
          after:bottom-0
          after:left-(--arrow-left)
          after:-translate-x-1/2
          after:translate-y-1/2
          after:-rotate-135
        `;

      case "bottom":
        return `
          after:top-0
          after:left-(--arrow-left)
          after:-translate-x-1/2
          after:-translate-y-1/2
          after:rotate-45
        `;

      case "left":
        return `
          after:right-0
          after:top-1/2
          after:-translate-y-1/2
          after:translate-x-1/2
          after:rotate-135
        `;

      case "right":
        return `
          after:left-0
          after:top-1/2
          after:-translate-y-1/2
          after:-translate-x-1/2
          after:-rotate-45
        `;
    }
  };

  return createPortal(
    <div
      ref={contentRef}
      style={
        {
          position: "fixed",
          zIndex: 9999,
          ...positionStyle,
          "--arrow-left": arrowLeft,
        } as React.CSSProperties
      }
      className={cn(
        `
        whitespace-nowrap
        rounded
        bg-background
        px-2
        py-1
        text-xs
        text-foreground
        after:absolute
        after:size-2
        after:bg-background
        after:content-['']
      `,
        getArrowClass(),
        className,
      )}
      {...props}
    >
      {children || tooltip}
    </div>,
    document.body,
  );
};

export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});
