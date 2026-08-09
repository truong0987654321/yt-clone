"use client";

import { HomeNavbar } from "@/components/navbar/HomeNavbar";
import { HomeSidebar } from "@/components/sidebar/HomeSidebar";
import {
  Sidebar,
  SidebarHeader,
  SidebarMain,
  SidebarProvider,
} from "@/components/ui/sidebar/sidebar";
import { useState } from "react";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarProvider
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
      className="[&:not(:has(.activity-bar))]:[grid-template-areas:'header_header''sidebar_main'] overflow-hidden"
    >
      <SidebarHeader>
        <HomeNavbar />
      </SidebarHeader>
      <Sidebar className="shadow-none">
        <HomeSidebar isCollapsed={isCollapsed} />
      </Sidebar>
      <SidebarMain className="max-h-[calc(100vh-3.5rem)]">
        {children}
      </SidebarMain>
    </SidebarProvider>
  );
};
