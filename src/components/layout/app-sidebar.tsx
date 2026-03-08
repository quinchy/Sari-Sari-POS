"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { FullLogo, IconLogo } from "@/components/layout/app-logo";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  ShoppingBag01Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";
import {
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  {
    icon: Home01Icon,
    name: "Home",
    href: "/",
  },
  {
    icon: ShoppingBag01Icon,
    name: "Products",
    href: "/products",
  },
  {
    icon: CreditCardIcon,
    name: "GCash",
    href: "/gcash",
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();

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
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navItems.map(({ icon: Icon, name, href }) => {
                  const isActive = pathname === href;

                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        tooltip={name}
                        className={`mx-auto h-auto p-0 ${
                          isActive
                            ? "bg-primary text-background active:bg-primary active:text-background hover:text-background hover:bg-primary hover:opacity-85"
                            : "hover:bg-muted"
                        }`}
                      >
                        <Link
                          href={href}
                          className={`flex w-full items-center gap-3 px-3 py-2 rounded-md group-data-[collapsible=icon]:shrink-0 group-data-[collapsible=icon]:p-0`}
                        >
                          <HugeiconsIcon
                            icon={Icon}
                            fill="var(--background)"
                            color={isActive ? "var(--primary)" : ""}
                            strokeWidth={2}
                            className="scale-125"
                          />
                          <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                            {name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
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
