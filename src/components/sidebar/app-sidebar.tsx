"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { FullLogo, IconLogo } from "@/components/app-logo";
import { AppSidebarContent } from "@/components/sidebar/app-sidebar-content";

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        {open ? (
          <div className="px-3">
            <FullLogo />
          </div>
        ) : (
          <IconLogo />
        )}
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarContent />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
