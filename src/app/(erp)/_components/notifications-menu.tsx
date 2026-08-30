"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { notifications as seedNotifications } from "@/data/erp/notifications";
import { formatRelative } from "@/lib/erp/format";

export function NotificationsMenu() {
  const [readIds, setReadIds] = useState<string[]>([]);
  const items = useMemo(
    () => seedNotifications.map((item) => ({ ...item, read: item.read || readIds.includes(item.id) })),
    [readIds],
  );
  const unread = items.filter((item) => !item.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${unread} unread`}>
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive font-medium text-[10px] text-white">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(24rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div>
            <p className="font-medium text-sm">Notifications</p>
            <p className="text-muted-foreground text-xs">{unread} unread across all modules</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setReadIds(seedNotifications.map((item) => item.id));
              toast.success("All notifications marked as read.");
            }}
          >
            <CheckCheck data-icon="inline-start" />
            Mark all
          </Button>
        </div>
        <Separator />
        <ScrollArea className="h-96">
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  prefetch={false}
                  href={item.href}
                  onClick={() => setReadIds((current) => [...current, item.id])}
                  className="block px-4 py-3 transition-colors hover:bg-muted/60"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm">{item.title}</p>
                    {!item.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 text-muted-foreground text-xs">{item.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusBadge status={item.category} tone={item.tone} />
                    <span className="text-muted-foreground text-xs">{formatRelative(item.timestamp)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
