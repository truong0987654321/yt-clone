import { useI18n } from "@/i18n/context";
import { Sidebar } from "../ui/sidebar";
import { SidebarGuestItems } from "./SidebarGuestItems";
interface HomeSidebarProps {
  isCollapsed: boolean;
}
export const HomeSidebar = ({ isCollapsed }: HomeSidebarProps) => {
  const { t } = useI18n();
  return (
    <Sidebar.Container className="max-h-[calc(100vh-3.5rem)]">
      <Sidebar.ItemContainer>
        <SidebarGuestItems isCollapsed={isCollapsed} />
        <div className="border-t border-solid border-border p-[12px_24px] visible group-[.is-collapsed]:invisible group-[.is-collapsed]:delay-0 delay-140">
          {t("sidebar.note")}
        </div>
      </Sidebar.ItemContainer>
    </Sidebar.Container>
  );
};
