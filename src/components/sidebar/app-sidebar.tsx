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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "motion/react";

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <motion.aside
      className="relative"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
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
      <motion.div
        className="absolute z-20 top-4 right-0"
        variants={{
          rest: { x: 0, opacity: 0 },
          hover: { x: open ? -15 : -19, opacity: 1 },
        }}
        transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
      >
        <SidebarTrigger className="bg-secondary text-background hover:text-background hover:bg-secondary" />
      </motion.div>
    </motion.aside>
  );
}
