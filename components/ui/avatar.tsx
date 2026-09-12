import { cn } from "@/lib/utils/cn";
import Image, { ImageProps } from "next/image";

type BasicType = React.HTMLAttributes<HTMLDivElement>;

interface AvatarImgProps extends ImageProps {
  size?: number;
}

const AvatarRoot = ({ children, ...props }: BasicType) => {
  return (
    <div
      className="bg-none border-none flex items-center justify-center p-0"
      {...props}
    >
      {children}
    </div>
  );
};

const AvatarImg = ({ alt, size = 40, className, ...props }: AvatarImgProps) => {
  return (
    <Image
      {...props}
      alt={alt ?? ""}
      width={size}
      height={size}
      className={cn(
        "cursor-pointer bg-transparent m-[0_8px] rounded-[50%] overflow-hidden inline-block flex-none",
        className,
      )}
    />
  );
};

export const Avatar = Object.assign(AvatarRoot, {
  Img: AvatarImg,
});
