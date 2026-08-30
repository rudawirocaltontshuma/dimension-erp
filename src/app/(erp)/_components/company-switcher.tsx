"use client";

import { useState } from "react";

import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { companies } from "@/data/erp/organisation";

export function CompanySwitcher() {
  const [activeId, setActiveId] = useState(companies[0].id);
  const active = companies.find((company) => company.id === activeId) ?? companies[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-[13rem] justify-between gap-2">
          <Building2 className="size-4 shrink-0" />
          <span className="hidden truncate lg:inline">{active.name}</span>
          <ChevronsUpDown className="size-3.5 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Group companies</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {companies.map((company) => (
          <DropdownMenuItem
            key={company.id}
            onSelect={() => {
              setActiveId(company.id);
              toast.success(`Switched to ${company.name}.`, {
                description: "Company context is illustrative in this demonstration.",
              });
            }}
            className="flex items-start gap-2"
          >
            <Check className={company.id === activeId ? "mt-0.5 size-4 opacity-100" : "mt-0.5 size-4 opacity-0"} />
            <span className="min-w-0">
              <span className="block truncate font-medium text-sm">{company.name}</span>
              <span className="block text-muted-foreground text-xs">{company.headquarters}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
