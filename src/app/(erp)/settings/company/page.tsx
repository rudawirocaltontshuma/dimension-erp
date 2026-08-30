"use client";

import { useState } from "react";

import { toast } from "sonner";

import { SectionCard } from "@/components/erp/detail-panels";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY, companies } from "@/data/erp/organisation";

export default function CompanySettingsPage() {
  const [form, setForm] = useState({
    legalName: COMPANY.legalName,
    tradingName: "Enterprise Group",
    registration: COMPANY.registration,
    vat: COMPANY.vatNumber,
    email: COMPANY.email,
    phone: COMPANY.phone,
    website: COMPANY.website,
    fiscalYear: COMPANY.fiscalYearStart,
    address: `${COMPANY.headOffice.line1}\n${COMPANY.headOffice.line2}\n${COMPANY.headOffice.city}, ${COMPANY.headOffice.province} ${COMPANY.headOffice.postalCode}\n${COMPANY.headOffice.country}`,
  });

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-6">
      <SectionCard title="Company profile" description="Registered details used across documents and reports.">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("Demo changes applied.", {
              description: "Company details are not persisted in this demonstration.",
            });
          }}
        >
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="legalName">Registered name</FieldLabel>
              <Input
                id="legalName"
                value={form.legalName}
                onChange={(event) => update("legalName", event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="tradingName">Trading name</FieldLabel>
              <Input
                id="tradingName"
                value={form.tradingName}
                onChange={(event) => update("tradingName", event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="registration">Company registration</FieldLabel>
              <Input
                id="registration"
                value={form.registration}
                onChange={(event) => update("registration", event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="vat">VAT number</FieldLabel>
              <Input id="vat" value={form.vat} onChange={(event) => update("vat", event.target.value)} />
              <FieldDescription>Printed on every tax invoice.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Operations email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Switchboard</FieldLabel>
              <Input id="phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="website">Website</FieldLabel>
              <Input id="website" value={form.website} onChange={(event) => update("website", event.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="fiscalYear">Financial year starts</FieldLabel>
              <Input
                id="fiscalYear"
                value={form.fiscalYear}
                onChange={(event) => update("fiscalYear", event.target.value)}
              />
            </Field>
          </FieldGroup>
          <Field>
            <FieldLabel htmlFor="address">Head office address</FieldLabel>
            <Textarea
              id="address"
              rows={4}
              value={form.address}
              onChange={(event) => update("address", event.target.value)}
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Save Demo</Button>
            <Button type="button" variant="outline" onClick={() => toast.info("Changes discarded.")}>
              Cancel
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Group companies" description="Entities available in the company switcher.">
        <ul className="divide-y">
          {companies.map((company) => (
            <li key={company.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-medium text-sm">{company.name}</p>
                <p className="text-muted-foreground text-sm">{company.description}</p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Registration {company.registration} · {company.headquarters} · {company.employees} employees
                </p>
              </div>
              <StatusBadge status={company.baseCurrency} tone="info" />
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
