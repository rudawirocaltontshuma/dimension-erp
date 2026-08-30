"use client";

import { useState } from "react";

import { toast } from "sonner";

import { SectionCard } from "@/components/erp/detail-panels";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";

const TOGGLES = [
  { id: "creditCheck", label: "Enforce credit limit checks on new orders", defaultValue: true },
  { id: "autoReserve", label: "Automatically reserve stock when an order is captured", defaultValue: true },
  {
    id: "approvalThreshold",
    label: "Require second approval on purchase orders above R 500,000.00",
    defaultValue: true,
  },
  { id: "backorders", label: "Allow backorders when stock is unavailable", defaultValue: false },
  { id: "autoNumbering", label: "Automatically number new documents", defaultValue: true },
  { id: "auditTrail", label: "Record an audit trail entry for every change", defaultValue: true },
];

export default function SystemPreferencesPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TOGGLES.map((toggle) => [toggle.id, toggle.defaultValue])),
  );
  const [regional, setRegional] = useState({
    locale: "English (South Africa)",
    timezone: "Africa/Johannesburg (SAST, UTC+02:00)",
    dateFormat: "24 Jun 2026",
    numberFormat: "1,284,500.00",
    weekStart: "Monday",
  });

  return (
    <div className="space-y-6">
      <SectionCard title="Regional settings" description="Formats applied across the demonstration interface.">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("Demo changes applied.", {
              description: "System preferences are not persisted in this demonstration.",
            });
          }}
        >
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            {(
              [
                {
                  key: "locale",
                  label: "Language and region",
                  options: ["English (South Africa)", "English (United Kingdom)", "English (United States)"],
                },
                {
                  key: "timezone",
                  label: "Time zone",
                  options: [
                    "Africa/Johannesburg (SAST, UTC+02:00)",
                    "Europe/London (UTC+01:00)",
                    "America/New_York (UTC-04:00)",
                  ],
                },
                { key: "dateFormat", label: "Date format", options: ["24 Jun 2026", "2026-06-24", "24/06/2026"] },
                {
                  key: "numberFormat",
                  label: "Number format",
                  options: ["1,284,500.00", "1 284 500,00", "1.284.500,00"],
                },
                { key: "weekStart", label: "Week starts on", options: ["Monday", "Sunday"] },
              ] as const
            ).map((setting) => (
              <Field key={setting.key}>
                <FieldLabel htmlFor={setting.key}>{setting.label}</FieldLabel>
                <NativeSelect
                  className="w-full"
                  id={setting.key}
                  value={regional[setting.key]}
                  onChange={(event) => setRegional((current) => ({ ...current, [setting.key]: event.target.value }))}
                >
                  {setting.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            ))}
          </FieldGroup>
          <Button type="submit">Save Demo</Button>
        </form>
      </SectionCard>

      <SectionCard
        title="Module behaviour"
        description="Operational rules applied across sales, inventory and procurement."
      >
        <ul className="divide-y">
          {TOGGLES.map((toggle) => (
            <li key={toggle.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="font-medium text-sm">{toggle.label}</p>
                <FieldDescription>Applies to newly captured demonstration documents.</FieldDescription>
              </div>
              <Switch
                checked={toggles[toggle.id]}
                aria-label={toggle.label}
                onCheckedChange={(checked) => {
                  setToggles((current) => ({ ...current, [toggle.id]: checked }));
                  toast.success("Demo changes applied.", {
                    description: `${toggle.label} was ${checked ? "enabled" : "disabled"}.`,
                  });
                }}
              />
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
