import { HomeLayout } from "@/modules/home/ui/layouts/HomeLayout";

interface LayoutHomeProps {
  children: React.ReactNode;
}

export default function LayoutHome({ children }: LayoutHomeProps) {
  return <HomeLayout>{children}</HomeLayout>;
}
