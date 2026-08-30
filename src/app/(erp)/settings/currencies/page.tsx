"use client";

import { useState } from "react";

import { toast } from "sonner";

import { SectionCard } from "@/components/erp/detail-panels";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currencies } from "@/data/erp/organisation";
import { formatMoney } from "@/lib/erp/format";

export default function CurrencySettingsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(currencies.map((currency) => [currency.code, currency.status === "Active"])),
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title="Currencies"
        description="Base currency and foreign currencies available for trading documents."
      >
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Rate to ZAR</TableHead>
                <TableHead>Base</TableHead>
                <TableHead>Enabled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.map((currency) => (
                <TableRow key={currency.code}>
                  <TableCell className="font-medium">{currency.code}</TableCell>
                  <TableCell>{currency.name}</TableCell>
                  <TableCell className="text-muted-foreground">{currency.symbol}</TableCell>
                  <TableCell className="text-right tabular-nums">{currency.rateToZar.toFixed(2)}</TableCell>
                  <TableCell>
                    {currency.isBase ? (
                      <StatusBadge status="Base currency" tone="success" />
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={enabled[currency.code]}
                      disabled={currency.isBase}
                      aria-label={`Enable ${currency.name}`}
                      onCheckedChange={(checked) => {
                        setEnabled((current) => ({ ...current, [currency.code]: checked }));
                        toast.success("Demo changes applied.", {
                          description: `${currency.name} was ${checked ? "enabled" : "disabled"} in this demonstration.`,
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Conversion example" description="Indicative conversion using the stored demonstration rates.">
        <ul className="divide-y">
          {currencies
            .filter((currency) => !currency.isBase)
            .map((currency) => (
              <li key={currency.code} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-sm">{formatMoney(1000, currency.code)} converts to</span>
                <span className="font-medium text-sm tabular-nums">{formatMoney(1000 * currency.rateToZar)}</span>
              </li>
            ))}
        </ul>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() =>
            toast.info("Rates refreshed for demonstration.", { description: "No external rate provider is connected." })
          }
        >
          Refresh rates
        </Button>
      </SectionCard>
    </div>
  );
}
