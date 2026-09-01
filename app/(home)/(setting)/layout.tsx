import { SettingSidebar } from "@/components/SettingSidebar";

interface LayoutHomeProps {
  children: React.ReactNode;
}
export default function LayoutHomeProps({ children }: LayoutHomeProps) {
  return (
    <div>
      <SettingSidebar />

      <div className="flex-1 basis-[0.000000001px] ml-64">
        <div className="w-full max-w-270 pb-0 flex flex-row flex-none mb-4">
          <div className="my-0 mx-18 w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
