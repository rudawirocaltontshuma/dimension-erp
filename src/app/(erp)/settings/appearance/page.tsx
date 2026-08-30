"use client";

import { useState } from "react";

import { Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { SectionCard } from "@/components/erp/detail-panels";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

const DISPLAY_OPTIONS = [
  {
    id: "compactTables",
    label: "Compact table density",
    description: "Reduce row height on data tables.",
    defaultValue: false,
  },
  {
    id: "stickyHeader",
    label: "Sticky page header",
    description: "Keep the page header visible while scrolling.",
    defaultValue: true,
  },
  {
    id: "showKpiTrends",
    label: "Show KPI trend indicators",
    description: "Display period-on-period movement on KPI cards.",
    defaultValue: true,
  },
  {
    id: "chartLegends",
    label: "Show chart legends",
    description: "Display legends beneath every chart.",
    defaultValue: true,
  },
];

export default function AppearanceSettingsPage() {
  const { themeMode, setPreference } = usePreferencesStore(
    useShallow((state) => ({ themeMode: state.values.theme_mode, setPreference: state.setPreference })),
  );
  const [options, setOptions] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DISPLAY_OPTIONS.map((option) => [option.id, option.defaultValue])),
  );

  return (
    <div className="space-y-6">
      <SectionCard title="Theme" description="Light, dark and system themes are supported across every screen.">
        <ToggleGroup
          type="single"
          variant="outline"
          value={themeMode}
          onValueChange={(value) => {
            if (!value) return;
            setPreference("theme_mode", value as "light" | "dark" | "system");
            toast.success("Demo changes applied.", { description: `Theme switched to ${value}.` });
          }}
        >
          <ToggleGroupItem value="light">
            <Sun className="size-4" />
            Light
          </ToggleGroupItem>
          <ToggleGroupItem value="dark">
            <Moon className="size-4" />
            Dark
          </ToggleGroupItem>
          <ToggleGroupItem value="system">
            <Monitor className="size-4" />
            System
          </ToggleGroupItem>
        </ToggleGroup>
      </SectionCard>

      <SectionCard
        title="Display options"
        description="Presentation preferences applied to the demonstration interface."
      >
        <ul className="divide-y">
          {DISPLAY_OPTIONS.map((option) => (
            <li key={option.id} className="flex items-center justify-between gap-4 py-3">
              <Field className="min-w-0">
                <FieldLabel htmlFor={option.id}>{option.label}</FieldLabel>
                <FieldDescription>{option.description}</FieldDescription>
              </Field>
              <Switch
                id={option.id}
                checked={options[option.id]}
                onCheckedChange={(checked) => {
                  setOptions((current) => ({ ...current, [option.id]: checked }));
                  toast.success("Demo changes applied.", {
                    description: `${option.label} ${checked ? "enabled" : "disabled"}.`,
                  });
                }}
              />
            </li>
          ))}
        </ul>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => {
            setOptions(Object.fromEntries(DISPLAY_OPTIONS.map((option) => [option.id, option.defaultValue])));
            toast.info("Display options reset.", { description: "Defaults restored for this demonstration session." });
          }}
        >
          Reset to defaults
        </Button>
      </SectionCard>
    </div>
  );
}
