import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { ButtonIcon } from "./button";
import { cn } from "@/lib/utils/cn";

type BasicType = React.HTMLAttributes<HTMLDivElement>;

type DialogActionsProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

interface DialogContextType extends BasicType {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

function useDialog(): DialogContextType {
  const ctx = useContext(DialogContext);
  if (!ctx)
    throw new Error("All Dialog.* components must be placed inside <Dialog>.");
  return ctx;
}

export const DialogRoot = ({ open, setOpen, children }: DialogContextType) => {
  const [isOpen, setIsOpen] = useState(false);
  const controlledOpen = open ?? isOpen;
  const controlledSetOpen = setOpen ?? setIsOpen;
  if (!open) return null;

  const value: DialogContextType = {
    open: controlledOpen,
    setOpen: controlledSetOpen,
  };

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
};

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}
const X = ({ size = 16, ...props }: SvgProps) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      width={size}
      height={size}
      {...props}
    >
      <path
        d="M1.791.722a.756.756 0 0 0-1.07 1.07L3.932 5 .72 8.209a.756.756 0 1 0 1.07 1.07L5 6.068l3.209 3.21a.756.756 0 0 0 1.07-1.07L6.068 5l3.21-3.209a.756.756 0 1 0-1.07-1.07L5 3.932 1.791.72Z"
        fill="currentColor"
      />
    </svg>
  );
};

const DialogContent = ({ children, className, ...props }: BasicType) => {
  const { setOpen } = useDialog();

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40"
      onClick={() => setOpen?.(false)}
    >
      <div
        className={cn(
          "relative z-50 flex flex-col w-full max-w-md gap-4 rounded-lg border border-border bg-background shadow-lg duration-200",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <ButtonIcon
          onClick={() => setOpen?.(false)}
          className="absolute right-4 top-4 opacity-70 hover:bg-btn-hover"
          sizeIcon="size-3"
        >
          <X />
        </ButtonIcon>
        {children}
      </div>
    </div>,
    document.body,
  );
};

const DialogTrigger = ({
  children,
  className,
  ...props
}: DialogActionsProps) => {
  const { setOpen } = useDialog();
  return (
    <button
      onClick={() => setOpen?.(true)}
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
};

const DialogHeader = ({ children, className, ...props }: BasicType) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 space-y-2 text-left px-6 pt-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className, ...props }: BasicType) => {
  return (
    <h2
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    >
      {children}
    </h2>
  );
};

const DialogDescription = ({ children, className, ...props }: BasicType) => {
  return (
    <div
      className={cn("text-sm text-foreground/60 pl-2", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogFooter = ({ children, className, ...props }: BasicType) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2 px-6 pb-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogCancel = ({
  children,
  className,
  disabled,
  ...props
}: DialogActionsProps) => {
  const { setOpen } = useDialog();
  return (
    <button
      disabled={disabled}
      type="button"
      className={cn(
        "inline-flex justify-center items-center cursor-pointer gap-2 whitespace-normal rounded-[.625rem] text-sm font-medium transition-colors bg-btn-secondary text-foreground hover:bg-btn-secondary-hover h-9 px-4 py-2 border border-border",
        disabled ?? "disabled:cursor-not-allowed",
        className,
      )}
      onClick={() => setOpen?.(false)}
      {...props}
    >
      {children}
    </button>
  );
};

const DialogAction = ({
  children,
  onClick,
  className,
  disabled,
  ...props
}: DialogActionsProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="submit"
      className={cn(
        "inline-flex justify-center items-center cursor-pointer gap-2 whitespace-normal rounded-[.625rem] text-sm font-medium transition-colors bg-btn-action text-foreground-secondary h-9 px-4 py-2 hover:bg-btn-action-hover",
        disabled ?? "disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {disabled && (
        <span className="inline-block w-4 h-4 border-2 border-t-transparent border-foreground rounded-full animate-spin mr-2"></span>
      )}
      {children}
    </button>
  );
};

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Cancel: DialogCancel,
  Action: DialogAction,
});
