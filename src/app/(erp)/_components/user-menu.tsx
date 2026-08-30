"use client";

import { useState } from "react";

import Link from "next/link";

import { Info, Keyboard, Monitor, Moon, Settings, Sun, UserRound } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { COMPANY, demoUser } from "@/data/erp/organisation";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

const SHORTCUTS = [
  { keys: "⌘ K", action: "Open global search and command menu" },
  { keys: "⌘ B", action: "Toggle the navigation sidebar" },
  { keys: "Esc", action: "Close the active dialog, sheet or menu" },
  { keys: "Tab", action: "Move focus between interactive controls" },
  { keys: "Enter", action: "Open the focused table row or menu item" },
];

export function UserMenu() {
  const [openDialog, setOpenDialog] = useState<"profile" | "shortcuts" | "about" | null>(null);
  const { themeMode, setPreference } = usePreferencesStore(
    useShallow((state) => ({ themeMode: state.values.theme_mode, setPreference: state.setPreference })),
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 px-1.5" aria-label="Open the demo profile menu">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
              {demoUser.initials}
            </span>
            <span className="hidden text-left leading-tight lg:grid">
              <span className="truncate font-medium text-sm">{demoUser.name}</span>
              <span className="truncate text-muted-foreground text-xs">{demoUser.role}</span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="space-y-0.5">
            <p className="font-medium text-sm">{demoUser.name}</p>
            <p className="text-muted-foreground text-xs">{demoUser.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setOpenDialog("profile")}>
            <UserRound className="size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link prefetch={false} href="/settings/system">
              <Settings className="size-4" />
              Preferences
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setOpenDialog("shortcuts")}>
            <Keyboard className="size-4" />
            Keyboard shortcuts
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setOpenDialog("about")}>
            <Info className="size-4" />
            Demo information
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="size-4" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={themeMode}
                onValueChange={(value) => setPreference("theme_mode", value as "light" | "dark" | "system")}
              >
                <DropdownMenuRadioItem value="light">
                  <Sun className="size-4" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="size-4" />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <Monitor className="size-4" />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog === "profile"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demo profile</DialogTitle>
            <DialogDescription>
              A fictional profile used to demonstrate the platform shell. No authentication provider is connected.
            </DialogDescription>
          </DialogHeader>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-xs uppercase">Name</dt>
              <dd className="font-medium">{demoUser.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs uppercase">Role</dt>
              <dd className="font-medium">{demoUser.role}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs uppercase">Department</dt>
              <dd className="font-medium">{demoUser.department}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs uppercase">Location</dt>
              <dd className="font-medium">{demoUser.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs uppercase">Email</dt>
              <dd className="font-medium">{demoUser.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs uppercase">Contact</dt>
              <dd className="font-medium">{demoUser.phone}</dd>
            </div>
          </dl>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "shortcuts"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard shortcuts</DialogTitle>
            <DialogDescription>Navigate the platform without leaving the keyboard.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2">
            {SHORTCUTS.map((shortcut) => (
              <li key={shortcut.keys} className="flex items-center justify-between gap-4 border-b pb-2 last:border-b-0">
                <span className="text-sm">{shortcut.action}</span>
                <Kbd>{shortcut.keys}</Kbd>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "about"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About this demonstration</DialogTitle>
            <DialogDescription>
              {COMPANY.name} — {COMPANY.subtitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-muted-foreground text-sm">
            <p>
              Enterprise ERP is a frontend-only enterprise resource planning demonstration created for portfolio
              purposes. Every record shown is fictional mock data held in local TypeScript files.
            </p>
            <p>
              The platform does not connect to a production database, authentication provider, financial service,
              banking service, payment provider or external business system. Actions such as saving, approving or
              exporting show interface feedback only.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
