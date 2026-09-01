import { Sidebar } from "../ui/sidebar";
import { SidebarGuestItems } from "./SidebarGuestItems";
interface HomeSidebarProps {
  isCollapsed: boolean;
}
export const HomeSidebar = ({ isCollapsed }: HomeSidebarProps) => {
  return (
    <Sidebar.Container className="max-h-[calc(100vh-3.5rem)]">
      <Sidebar.ItemContainer>
        <SidebarGuestItems isCollapsed={isCollapsed} />
        <div className="group-[.is-collapsed]:hidden border-t border-solid border-border p-[12px_24px]">
          This is not a real commercial application.
        </div>
      </Sidebar.ItemContainer>
    </Sidebar.Container>
  );
};
