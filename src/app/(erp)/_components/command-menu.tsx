"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Moon, Search } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { searchEntries, searchGroupOrder } from "@/lib/erp/search-index";
import { quickCommands } from "@/navigation/erp-navigation";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { themeMode, setPreference } = usePreferencesStore(
    useShallow((state) => ({ themeMode: state.values.theme_mode, setPreference: state.setPreference })),
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => searchEntries(query), [query]);

  const grouped = useMemo(
    () =>
      searchGroupOrder
        .map((group) => ({ group, items: results.filter((entry) => entry.group === group) }))
        .filter((entry) => entry.items.length > 0),
    [results],
  );

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router],
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full justify-start gap-2 text-muted-foreground md:w-64"
        aria-label="Open global search and command menu"
      >
        <Search className="size-4" />
        <span className="hidden truncate sm:inline">Search Enterprise ERP…</span>
        <span className="sm:hidden">Search</span>
        <Kbd className="ml-auto hidden md:inline-flex">⌘K</Kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Global search"
        description="Search customers, products, orders, suppliers, employees, projects and more."
      >
        <CommandInput value={query} onValueChange={setQuery} placeholder="Search records or run a command…" />
        <CommandList>
          <CommandEmpty>No matching records in the demonstration dataset.</CommandEmpty>

          {grouped.map((entry) => (
            <CommandGroup key={entry.group} heading={entry.group}>
              {entry.items.map((item) => (
                <CommandItem
                  key={`${item.group}-${item.id}`}
                  value={`${item.title} ${item.id}`}
                  onSelect={() => go(item.href)}
                >
                  <span className="truncate font-medium">{item.title}</span>
                  <span className="ml-auto truncate text-muted-foreground text-xs">{item.subtitle}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

          {grouped.length > 0 && <CommandSeparator />}

          <CommandGroup heading="Navigation">
            {quickCommands.map((command) => (
              <CommandItem key={command.url + command.title} value={command.title} onSelect={() => go(command.url)}>
                <command.icon className="size-4" />
                <span>{command.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Actions">
            <CommandItem
              value="Toggle theme"
              onSelect={() => {
                const next = themeMode === "dark" ? "light" : "dark";
                setPreference("theme_mode", next);
                setOpen(false);
                toast.success("Theme updated.", { description: `Switched to the ${next} appearance.` });
              }}
            >
              <Moon className="size-4" />
              <span>Toggle Theme</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
