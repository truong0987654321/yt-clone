import { cn } from "@/lib/utils/cn";
import { Ring } from "./icons/Icon";

interface LoadingProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const Loading = ({ className }: LoadingProps) => {
  return <Ring fill="none" className={cn("size-6 animate-spin", className)} />;
};
