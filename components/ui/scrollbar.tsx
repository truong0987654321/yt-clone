import { cn } from "@/lib/utils/cn";
import { HtmlHTMLAttributes } from "react";

interface ScrollbarProps extends HtmlHTMLAttributes<HTMLDivElement> {
  size?: number;
}

export const Scrollbar = ({
  children,
  className,
  size = 1,
}: ScrollbarProps) => {
  return (
    <div
      style={
        {
          "--scrollbar-size": `${size * 4}px`,
        } as React.CSSProperties
      }
      className={cn(
        "overflow-x-hidden overflow-y-auto overscroll-none",
        "[&::-webkit-scrollbar-thumb]:cursor-pointer",
        "[&::-webkit-scrollbar-thumb]:rounded-lg hover:[&::-webkit-scrollbar-thumd]:rounded-lg",
        "hover:[&::-webkit-scrollbar-thumb]:bg-scrollbar",
        "[&::-webkit-scrollbar-thumb:hover]:bg-scrollbar-hover",
        `[&::-webkit-scrollbar]:size-(--scrollbar-size) hover:[&::-webkit-scrollbar]:size-(--scrollbar-size)`,
        className,
      )}
    >
      {children}
    </div>
  );
};
