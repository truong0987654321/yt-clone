import { cn } from "@/lib/utils/cn";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({
  className,
  label,
  placeholder,
  disabled,
  id,
  ...props
}: InputProps) => {
  return (
    <div className="block rounded-xl px-2 py-1 border border-solid border-border">
      <div className="flex flex-row items-center relative">
        <div className="static flex-[1_1_auto] max-w-full">
          <div className="relative outline-none shadow-none p-0 m-0 bg-transparent text-foreground text-[16px] font-normal leading-6">
            <input
              id={id}
              placeholder={placeholder ?? ""}
              disabled={disabled}
              className={cn(
                "peer relative outline-none shadow-none max-w-full bg-transparent",
                "pt-4", // chừa chỗ phía trên cho label khi nó bay lên
                disabled
                  ? "disabled:cursor-not-allowed text-foreground opacity-50"
                  : "",
                className ? className : "",
              )}
              {...props}
            />

            {label && (
              <label
                htmlFor={id}
                className={cn(
                  "font-normal text-foreground-tertiary",
                  "absolute left-0 origin-top-left pointer-events-none truncate max-w-full",
                  "text-[16px] leading-6 top-1/2 -translate-y-1/2", // mặc định: nằm giữa, đè lên value
                  "transition-all duration-150",
                  // khi FOCUS hoặc đã CÓ giá trị (input không còn show placeholder) -> bay lên trên, thu nhỏ
                  "peer-focus:top-0 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-[17px]",
                  "peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:text-[17px]",
                )}
              >
                {label}
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
