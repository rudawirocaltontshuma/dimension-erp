import { Fragment } from "react";

import { ChartCard, ErpBarChart } from "@/components/erp/charts";
import { PrintButton } from "@/components/erp/demo-actions";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { profitAndLoss } from "@/data/erp/finance";
import { COMPANY } from "@/data/erp/organisation";
import { formatMoney, formatPercent } from "@/lib/erp/format";
import { cn } from "@/lib/utils";

const GROUPS = ["Revenue", "Cost of Sales", "Operating Expenses", "Other Income", "Other Expenses"] as const;

function sumGroup(group: string, key: "current" | "prior") {
  return profitAndLoss.lines.filter((line) => line.group === group).reduce((sum, line) => sum + line[key], 0);
}

export default function ProfitLossPage() {
  const revenue = sumGroup("Revenue", "current");
  const priorRevenue = sumGroup("Revenue", "prior");
  const cogs = sumGroup("Cost of Sales", "current");
  const grossProfit = revenue - cogs;
  const opex = sumGroup("Operating Expenses", "current");
  const operatingProfit = grossProfit - opex;
  const otherIncome = sumGroup("Other Income", "current");
  const otherExpenses = sumGroup("Other Expenses", "current");
  const netProfit = operatingProfit + otherIncome - otherExpenses;

  const priorNet =
    priorRevenue -
    sumGroup("Cost of Sales", "prior") -
    sumGroup("Operating Expenses", "prior") +
    sumGroup("Other Income", "prior") -
    sumGroup("Other Expenses", "prior");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profit & Loss Statement"
        description={`${COMPANY.legalName} · ${profitAndLoss.period}`}
        breadcrumbs={[
          { label: "Reports", href: "/reports" },
          { label: "Finance", href: "/reports/finance" },
          { label: "Profit & Loss" },
        ]}
        actions={<PrintButton label="Print statement" />}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Revenue"
          value={formatMoney(revenue)}
          change={((revenue - priorRevenue) / priorRevenue) * 100}
          changeLabel="vs prior period"
        />
        <KpiCard
          label="Gross profit"
          value={formatMoney(grossProfit)}
          hint={`Margin ${formatPercent((grossProfit / revenue) * 100)}`}
        />
        <KpiCard
          label="Operating profit"
          value={formatMoney(operatingProfit)}
          hint={`Margin ${formatPercent((operatingProfit / revenue) * 100)}`}
        />
        <KpiCard
          label="Net profit"
          value={formatMoney(netProfit)}
          change={((netProfit - priorNet) / priorNet) * 100}
          changeLabel="vs prior period"
        />
      </section>

      <ChartCard title="Monthly performance" description="Revenue, expenses and profit by month.">
        <ErpBarChart
          data={profitAndLoss.monthly}
          xKey="month"
          money
          series={[
            { key: "revenue", label: "Revenue" },
            { key: "expenses", label: "Expenses" },
            { key: "profit", label: "Profit" },
          ]}
        />
      </ChartCard>

      <SectionCard
        title="Statement of comprehensive income"
        description="Current period compared with the prior period."
      >
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Line</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Prior</TableHead>
                <TableHead className="text-right">Variance</TableHead>
                <TableHead className="text-right">Variance %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GROUPS.map((group) => {
                const lines = profitAndLoss.lines.filter((line) => line.group === group);
                const groupCurrent = sumGroup(group, "current");
                const groupPrior = sumGroup(group, "prior");
                return (
                  <Fragment key={group}>
                    <TableRow className="bg-muted/40">
                      <TableCell className="font-semibold">{group}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatMoney(groupCurrent)}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">{formatMoney(groupPrior)}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatMoney(groupCurrent - groupPrior)}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatPercent(
                          groupPrior === 0 ? 0 : ((groupCurrent - groupPrior) / Math.abs(groupPrior)) * 100,
                        )}
                      </TableCell>
                    </TableRow>
                    {lines.map((line) => {
                      const variance = line.current - line.prior;
                      return (
                        <TableRow key={`${group}-${line.label}`}>
                          <TableCell className="pl-8">{line.label}</TableCell>
                          <TableCell className="text-right tabular-nums">{formatMoney(line.current)}</TableCell>
                          <TableCell className="text-right tabular-nums">{formatMoney(line.prior)}</TableCell>
                          <TableCell
                            className={cn(
                              "text-right tabular-nums",
                              variance >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400",
                            )}
                          >
                            {formatMoney(variance)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatPercent(line.prior === 0 ? 0 : (variance / Math.abs(line.prior)) * 100)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Fragment>
                );
              })}
              <TableRow className="bg-muted/60">
                <TableCell className="font-semibold">Gross profit</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{formatMoney(grossProfit)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMoney(priorRevenue - sumGroup("Cost of Sales", "prior"))}
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
              <TableRow className="bg-muted/60">
                <TableCell className="font-semibold">Operating profit</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{formatMoney(operatingProfit)}</TableCell>
                <TableCell colSpan={3} />
              </TableRow>
              <TableRow className="bg-muted">
                <TableCell className="font-semibold">Net profit for the period</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{formatMoney(netProfit)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatMoney(priorNet)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatMoney(netProfit - priorNet)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatPercent(((netProfit - priorNet) / priorNet) * 100)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <p className="text-muted-foreground text-xs">
        This statement is generated from fictional demonstration data and does not represent the financial position of
        any real organisation.
      </p>
    </div>
  );
}
