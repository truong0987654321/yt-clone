import { cn } from "@/lib/utils/cn";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixText?: string;
}

export const Input = ({
  className,
  label,
  prefixText,
  placeholder,
  disabled,
  id,
  ...props
}: InputProps) => {
  return (
    <div className="block rounded-xl px-2 py-1 border border-solid border-border group focus-within:border-btn-action">
      <div className="flex flex-row items-center relative">
        <div className="static flex-[1_1_auto] max-w-full">
          <div className="relative outline-none shadow-none p-0 m-0 bg-transparent text-foreground text-base font-normal flex flex-row">
            {prefixText && (
              <span className="pt-4 pr-0.5 text-foreground-tertiary font-medium select-none pointer-events-none">
                {prefixText}
              </span>
            )}
            <input
              id={id}
              placeholder={placeholder ?? ""}
              disabled={disabled}
              className={cn(
                "peer relative outline-none shadow-none max-w-full bg-transparent w-full",
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
                  "font-normal text-foreground-tertiary group-focus-within:text-btn-action absolute left-0 origin-top-left pointer-events-none truncate max-w-full transition-all duration-150",
                  prefixText
                    ? [
                        "top-0 translate-y-0 scale-75 text-[17px] peer-focus:text-btn-action",
                      ]
                    : [
                        "text-base top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-[17px] peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:text-[17px]",
                      ],
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
