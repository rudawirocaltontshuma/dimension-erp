import type { ReactNode } from "react";

import { cookies } from "next/headers";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./_components/app-sidebar";
import { CommandMenu } from "./_components/command-menu";
import { CompanySwitcher } from "./_components/company-switcher";
import { NotificationsMenu } from "./_components/notifications-menu";
import { ThemeSwitcher } from "./_components/theme-switcher";
import { UserMenu } from "./_components/user-menu";

export default async function ErpLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={{ "--sidebar-width": "calc(var(--spacing) * 66)" } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="min-w-0 overflow-x-clip">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 backdrop-blur-md print:hidden">
          <div className="flex w-full items-center justify-between gap-2 px-3 md:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-1 hidden data-[orientation=vertical]:h-4 sm:block" />
              <CommandMenu />
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="hidden rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-medium text-[11px] text-amber-700 uppercase tracking-wide xl:inline dark:text-amber-300">
                Demo mode
              </span>
              <CompanySwitcher />
              <NotificationsMenu />
              <ThemeSwitcher />
              <UserMenu />
            </div>
          </div>
        </header>
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
