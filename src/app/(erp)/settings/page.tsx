import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { SectionCard } from "@/components/erp/detail-panels";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    href: "/settings/company",
    title: "Company",
    description: "Legal entity, registration, VAT and head office details.",
  },
  {
    href: "/settings/locations",
    title: "Locations",
    description: "Offices, distribution centres, warehouses and branches.",
  },
  {
    href: "/settings/departments",
    title: "Departments",
    description: "Cost centres, managers, budgets and headcount.",
  },
  {
    href: "/settings/currencies",
    title: "Currencies",
    description: "Base and foreign currencies with indicative rates.",
  },
  { href: "/settings/tax", title: "Tax settings", description: "VAT rates, jurisdictions and tax treatment." },
  {
    href: "/settings/system",
    title: "System preferences",
    description: "Regional formats, defaults and module behaviour.",
  },
  {
    href: "/settings/numbering",
    title: "Numbering",
    description: "Document numbering formats and next sequence values.",
  },
  {
    href: "/settings/notifications",
    title: "Notifications",
    description: "Alert routing across modules and channels.",
  },
  { href: "/settings/appearance", title: "Appearance", description: "Theme, density and dashboard presentation." },
];

export default function SettingsIndexPage() {
  return (
    <SectionCard
      title="Configuration areas"
      description="Every administration screen in the demonstration is fully populated."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.map((section) => (
          <div key={section.href} className="flex flex-col justify-between gap-3 rounded-lg border p-4">
            <div>
              <p className="font-medium text-sm">{section.title}</p>
              <p className="mt-1 text-muted-foreground text-sm">{section.description}</p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link prefetch={false} href={section.href}>
                Open
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
