"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/settings/company", label: "Company" },
  { href: "/settings/locations", label: "Locations" },
  { href: "/settings/departments", label: "Departments" },
  { href: "/settings/currencies", label: "Currencies" },
  { href: "/settings/tax", label: "Tax settings" },
  { href: "/settings/system", label: "System preferences" },
  { href: "/settings/numbering", label: "Numbering" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/appearance", label: "Appearance" },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Administration sections" className="w-full overflow-x-auto">
      <ul className="flex w-max gap-1 rounded-lg border bg-muted/40 p-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                prefetch={false}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-sm transition-colors",
                  active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
