import { ChartCard, ErpBarChart } from "@/components/erp/charts";
import { PrintButton } from "@/components/erp/demo-actions";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cashFlow } from "@/data/erp/finance";
import { COMPANY } from "@/data/erp/organisation";
import { formatMoney } from "@/lib/erp/format";
import { cn } from "@/lib/utils";

interface Line {
  label: string;
  amount: number;
}

function total(lines: Line[]) {
  return lines.reduce((sum, line) => sum + line.amount, 0);
}

function ActivitySection({ title, lines }: { readonly title: string; readonly lines: Line[] }) {
  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>{title}</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line) => (
            <TableRow key={line.label}>
              <TableCell>{line.label}</TableCell>
              <TableCell
                className={cn(
                  "text-right tabular-nums",
                  line.amount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
                )}
              >
                {formatMoney(line.amount)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted/50">
            <TableCell className="font-semibold">Net cash from {title.toLowerCase()}</TableCell>
            <TableCell className="text-right font-semibold tabular-nums">{formatMoney(total(lines))}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default function CashFlowPage() {
  const operating = total(cashFlow.operating);
  const investing = total(cashFlow.investing);
  const financing = total(cashFlow.financing);
  const netChange = operating + investing + financing;
  const closingCash = cashFlow.openingCash + netChange;
  const inflows = [...cashFlow.operating, ...cashFlow.investing, ...cashFlow.financing]
    .filter((line) => line.amount > 0)
    .reduce((sum, line) => sum + line.amount, 0);
  const outflows = [...cashFlow.operating, ...cashFlow.investing, ...cashFlow.financing]
    .filter((line) => line.amount < 0)
    .reduce((sum, line) => sum + line.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cash Flow Statement"
        description={`${COMPANY.legalName} · ${cashFlow.period}`}
        breadcrumbs={[
          { label: "Reports", href: "/reports" },
          { label: "Finance", href: "/reports/finance" },
          { label: "Cash Flow" },
        ]}
        actions={<PrintButton label="Print statement" />}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Opening cash" value={formatMoney(cashFlow.openingCash)} hint="At the start of the period" />
        <KpiCard label="Total inflows" value={formatMoney(inflows)} hint="All activities" />
        <KpiCard label="Total outflows" value={formatMoney(outflows)} hint="All activities" />
        <KpiCard label="Closing cash" value={formatMoney(closingCash)} hint={`Net change ${formatMoney(netChange)}`} />
      </section>

      <ChartCard title="Cash inflow and outflow" description="Monthly cash movement across the period.">
        <ErpBarChart
          data={cashFlow.monthly}
          xKey="month"
          money
          series={[
            { key: "inflow", label: "Inflow" },
            { key: "outflow", label: "Outflow" },
          ]}
        />
      </ChartCard>

      <SectionCard title="Cash flow by activity">
        <div className="space-y-4">
          <ActivitySection title="Operating activities" lines={cashFlow.operating} />
          <ActivitySection title="Investing activities" lines={cashFlow.investing} />
          <ActivitySection title="Financing activities" lines={cashFlow.financing} />
        </div>
      </SectionCard>

      <SectionCard title="Reconciliation of cash">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Opening cash and equivalents</TableCell>
                <TableCell className="text-right tabular-nums">{formatMoney(cashFlow.openingCash)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Net cash from operating activities</TableCell>
                <TableCell className="text-right tabular-nums">{formatMoney(operating)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Net cash from investing activities</TableCell>
                <TableCell className="text-right tabular-nums">{formatMoney(investing)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Net cash from financing activities</TableCell>
                <TableCell className="text-right tabular-nums">{formatMoney(financing)}</TableCell>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableCell className="font-semibold">Closing cash and equivalents</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{formatMoney(closingCash)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <p className="text-muted-foreground text-xs">
        Cash movements shown here are fictional and prepared for a portfolio demonstration only.
      </p>
    </div>
  );
}
