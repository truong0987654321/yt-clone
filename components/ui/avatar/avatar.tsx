import { cn } from "@/lib/utils/cn";
import Image, { ImageProps } from "next/image";

type BasicType = React.HTMLAttributes<HTMLDivElement>;

interface AvatarImgProps extends ImageProps {
  size?: number;
}

export const Avatar = ({ children, ...props }: BasicType) => {
  return (
    <div
      className="pr-0 bg-none border-none flex items-center justify-center p-[1px_6px]"
      {...props}
    >
      {children}
    </div>
  );
};
export const AvatarImg = ({
  alt,
  size = 40,
  className,
  ...props
}: AvatarImgProps) => {
  return (
    <div className="cursor-pointer bg-transparent m-[0_8px] rounded-[50%] overflow-hidden inline-block flex-none">
      <Image
        {...props}
        alt={alt ?? ""}
        width={size}
        height={size}
        className={cn(className)}
      />
    </div>
  );
};
