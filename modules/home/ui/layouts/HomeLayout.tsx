"use client";

import { HomeNavbar } from "@/components/navbar/HomeNavbar";
import { ClientOnly } from "@/components/providers/ClientOnly";
import { HomeSidebar } from "@/components/sidebar/HomeSidebar";
import { Sidebar } from "@/components/ui/sidebar";
import { PAGES } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const specialPages = [PAGES.ACCOUNT_ADVANCED, PAGES.ACCOUNT];

  const isSpecialPage = specialPages.includes(pathname);
  return (
    <Sidebar
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
      special={isSpecialPage}
      className="[&:not(:has(.activity-bar))]:[grid-template-areas:'header_header''sidebar_main']"
    >
      <Sidebar.Header>
        <HomeNavbar />
      </Sidebar.Header>
      <Sidebar.Content className="shadow-none">
        <ClientOnly>
          <HomeSidebar isCollapsed={isCollapsed} />
        </ClientOnly>
      </Sidebar.Content>
      <Sidebar.Main className="max-h-[calc(100vh-3.5rem)]">
        {children}
      </Sidebar.Main>
    </Sidebar>
  );
};
