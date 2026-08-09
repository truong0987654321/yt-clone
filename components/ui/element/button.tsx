import { cn } from "@/lib/utils/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip/tooltip";

type BasicType = React.ButtonHTMLAttributes<HTMLButtonElement>;
type TooltipPosition = "top" | "bottom" | "left" | "right";
interface ButtonIcon extends BasicType {
  position?: TooltipPosition;
  gap?: number;
  sizeIcon?: string;
}

export const Button = ({
  children,
  className,
  disabled,
  ...props
}: BasicType) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        "transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const ButtonIcon = ({
  children,
  className,
  content,
  position = "top",
  gap = 8,
  sizeIcon,
  ...props
}: ButtonIcon) => {
  const button = (
    <button
      className={cn(
        "relative p-2 size-10 flex justify-center items-center rounded-full cursor-pointer group/button [&_span:first-child]:bg-btn",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-0 pointer-events-none rounded-[inherit] before:rounded-[inherit] group-hover/button:before:opacity-[.2] group-hover/button:before:bg-btn-hover group-hover/button:before:inset-0 group-hover/button:before:absolute z-0" />
      <span
        className={cn(
          "text-center text-[1.25rem] *:size-[inherit] *:[font-size:inherit] size-4 z-10",
          sizeIcon,
        )}
      >
        {children}
      </span>
    </button>
  );

  if (!content) return button; // 👈 không có content thì bỏ Tooltip

  return (
    <Tooltip tooltipPosition={position} gap={gap}>
      <TooltipTrigger>{button}</TooltipTrigger>
      <TooltipContent className="bg-background-secondary after:bg-background-secondary text-foreground-secondary">
        {content}
      </TooltipContent>
    </Tooltip>
  );
};
