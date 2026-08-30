"use client";

import { useState } from "react";

import { toast } from "sonner";

import { SectionCard } from "@/components/erp/detail-panels";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { taxRates } from "@/data/erp/organisation";
import { formatPercent } from "@/lib/erp/format";

export default function TaxSettingsPage() {
  const [defaultRate, setDefaultRate] = useState("VAT-15");
  const [pricesIncludeTax, setPricesIncludeTax] = useState(false);
  const [vatNumber, setVatNumber] = useState("4820158376");

  return (
    <div className="space-y-6">
      <SectionCard
        title="Tax configuration"
        description="Default treatment applied to new sales and purchase documents."
      >
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("Demo changes applied.", {
              description: "Tax configuration is not persisted in this demonstration.",
            });
          }}
        >
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="defaultRate">Default output tax rate</FieldLabel>
              <NativeSelect
                className="w-full"
                id="defaultRate"
                value={defaultRate}
                onChange={(event) => setDefaultRate(event.target.value)}
              >
                {taxRates.map((rate) => (
                  <option key={rate.id} value={rate.code}>
                    {rate.name} ({rate.code})
                  </option>
                ))}
              </NativeSelect>
              <FieldDescription>Applied to new sales orders, quotes and invoices.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="vatNumber">VAT registration number</FieldLabel>
              <Input id="vatNumber" value={vatNumber} onChange={(event) => setVatNumber(event.target.value)} />
            </Field>
          </FieldGroup>
          <Field orientation="horizontal">
            <Switch
              id="pricesIncludeTax"
              checked={pricesIncludeTax}
              onCheckedChange={(checked) => {
                setPricesIncludeTax(checked);
                toast.success("Demo changes applied.", {
                  description: checked
                    ? "Catalogue prices now display as tax inclusive."
                    : "Catalogue prices now display as tax exclusive.",
                });
              }}
            />
            <FieldLabel htmlFor="pricesIncludeTax">Catalogue prices include tax</FieldLabel>
          </Field>
          <Button type="submit">Save Demo</Button>
        </form>
      </SectionCard>

      <SectionCard title="Tax rates" description="Rates available across sales, procurement and finance documents.">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Jurisdiction</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxRates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.name}</TableCell>
                  <TableCell className="font-mono text-muted-foreground text-xs">{rate.code}</TableCell>
                  <TableCell className="text-muted-foreground">{rate.type}</TableCell>
                  <TableCell className="text-muted-foreground">{rate.jurisdiction}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPercent(rate.rate, 0)}</TableCell>
                  <TableCell>
                    <StatusBadge status={rate.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
