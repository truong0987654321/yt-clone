import { SidebarContainer, SidebarItemContainer } from "../ui/sidebar/sidebar";
import { SidebarGuestItems } from "./SidebarGuestItems";
interface HomeSidebarProps {
  isCollapsed: boolean;
}
export const HomeSidebar = ({ isCollapsed }: HomeSidebarProps) => {
  return (
    <SidebarContainer className="max-h-[calc(100vh-3.5rem)]">
      <SidebarItemContainer>
        <SidebarGuestItems isCollapsed={isCollapsed} />
        {!isCollapsed ? (
          <div className="border-t border-solid border-border p-[12px_24px_0]">
            This is not a real commercial application.
          </div>
        ) : null}
      </SidebarItemContainer>
    </SidebarContainer>
  );
};
