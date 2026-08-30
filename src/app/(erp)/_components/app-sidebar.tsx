"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Hexagon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { COMPANY } from "@/data/erp/organisation";
import { erpNavigation } from "@/navigation/erp-navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  const isActive = (url: string) => pathname === url || (url !== "/dashboard" && pathname.startsWith(`${url}/`));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip={COMPANY.name}>
              <Link prefetch={false} href="/dashboard">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Hexagon className="size-4" />
                </span>
                <span className="grid min-w-0 leading-tight">
                  <span className="truncate font-semibold text-sm">{COMPANY.name}</span>
                  <span className="truncate text-muted-foreground text-xs">{COMPANY.subtitle}</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {erpNavigation.map((group) => (
          <SidebarGroup key={group.id}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:pointer-events-none">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={`${group.id}-${item.title}-${item.url}`}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
                      <Link prefetch={false} href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {isCollapsed ? (
          <div
            title="Demo mode — frontend demonstration only"
            className="mx-auto rounded-md border border-amber-500/40 bg-amber-500/10 px-1.5 py-1 font-semibold text-[10px] text-amber-700 dark:text-amber-300"
          >
            D
          </div>
        ) : (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2">
            <p className="font-semibold text-amber-700 text-xs uppercase tracking-wide dark:text-amber-300">
              Demo mode
            </p>
            <p className="mt-0.5 text-muted-foreground text-xs">
              Frontend portfolio demonstration with fictional data. No live systems are connected.
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
