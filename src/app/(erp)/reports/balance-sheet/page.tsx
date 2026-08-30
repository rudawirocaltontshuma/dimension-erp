import { PrintButton } from "@/components/erp/demo-actions";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { balanceSheet } from "@/data/erp/finance";
import { COMPANY } from "@/data/erp/organisation";
import { formatMoney } from "@/lib/erp/format";

interface Line {
  label: string;
  amount: number;
}

function total(lines: Line[]) {
  return lines.reduce((sum, line) => sum + line.amount, 0);
}

function StatementTable({
  title,
  lines,
  totalLabel,
}: {
  readonly title: string;
  readonly lines: Line[];
  readonly totalLabel: string;
}) {
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
              <TableCell className="text-right tabular-nums">{formatMoney(line.amount)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted/50">
            <TableCell className="font-semibold">{totalLabel}</TableCell>
            <TableCell className="text-right font-semibold tabular-nums">{formatMoney(total(lines))}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default function BalanceSheetPage() {
  const currentAssets = total(balanceSheet.currentAssets);
  const nonCurrentAssets = total(balanceSheet.nonCurrentAssets);
  const currentLiabilities = total(balanceSheet.currentLiabilities);
  const longTermLiabilities = total(balanceSheet.longTermLiabilities);
  const equity = total(balanceSheet.equity);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Balance Sheet"
        description={`${COMPANY.legalName} · statement of financial position as at ${balanceSheet.asAt}`}
        breadcrumbs={[
          { label: "Reports", href: "/reports" },
          { label: "Finance", href: "/reports/finance" },
          { label: "Balance Sheet" },
        ]}
        actions={<PrintButton label="Print statement" />}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total assets"
          value={formatMoney(currentAssets + nonCurrentAssets)}
          hint="Current and non-current"
        />
        <KpiCard
          label="Total liabilities"
          value={formatMoney(currentLiabilities + longTermLiabilities)}
          hint="Current and long-term"
        />
        <KpiCard label="Total equity" value={formatMoney(equity)} hint="Share capital and reserves" />
        <KpiCard
          label="Working capital"
          value={formatMoney(currentAssets - currentLiabilities)}
          hint="Current assets less current liabilities"
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Assets">
          <div className="space-y-4">
            <StatementTable
              title="Current assets"
              lines={balanceSheet.currentAssets}
              totalLabel="Total current assets"
            />
            <StatementTable
              title="Non-current assets"
              lines={balanceSheet.nonCurrentAssets}
              totalLabel="Total non-current assets"
            />
          </div>
        </SectionCard>
        <SectionCard title="Equity and liabilities">
          <div className="space-y-4">
            <StatementTable
              title="Current liabilities"
              lines={balanceSheet.currentLiabilities}
              totalLabel="Total current liabilities"
            />
            <StatementTable
              title="Long-term liabilities"
              lines={balanceSheet.longTermLiabilities}
              totalLabel="Total long-term liabilities"
            />
            <StatementTable title="Equity" lines={balanceSheet.equity} totalLabel="Total equity" />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Statement summary">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Total assets</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMoney(currentAssets + nonCurrentAssets)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total liabilities</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMoney(currentLiabilities + longTermLiabilities)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableCell className="font-semibold">Net asset value</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatMoney(currentAssets + nonCurrentAssets - currentLiabilities - longTermLiabilities)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <p className="text-muted-foreground text-xs">
        Prepared from fictional demonstration data for portfolio purposes. It is not an audited or statutory statement.
      </p>
    </div>
  );
}
