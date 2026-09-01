import { cn } from "@/lib/utils/cn";
import { Check, CopyIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";

type BasicType = React.HTMLAttributes<HTMLDivElement>;

interface CopyContextType {
  value: string;
  copied: boolean;
  handleCopy: () => void;
}

interface CopyProps extends BasicType {
  valueCopy: string;
}

const CopyContext = createContext<CopyContextType | null>(null);

function useCopy(): CopyContextType {
  const ctx = useContext(CopyContext);
  if (!ctx)
    throw new Error("All Copy.* components must be placed inside <Copy>.");
  return ctx;
}

const CopyRoot = ({ valueCopy, children, className }: CopyProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(valueCopy);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const value: CopyContextType = {
    value: valueCopy,
    copied: copied,
    handleCopy: handleCopy,
  };
  return (
    <CopyContext.Provider value={value}>
      <div className={cn(className)}>{children}</div>
    </CopyContext.Provider>
  );
};

const CopyText = ({ className }: BasicType) => {
  const { value } = useCopy();
  return <div className={cn(className)}>{value}</div>;
};

const CopyButton = ({ className }: BasicType) => {
  const { copied, handleCopy } = useCopy();
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn("cursor-pointer", className)}
    >
      {copied ? <Check className="size-4" /> : <CopyIcon className="size-4" />}
    </button>
  );
};

export const Copy = Object.assign(CopyRoot, {
  Text: CopyText,
  Button: CopyButton,
});
