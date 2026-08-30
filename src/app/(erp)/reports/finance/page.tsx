import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { ChartCard, ErpBarChart, ErpPieChart } from "@/components/erp/charts";
import { DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { expenseBreakdown } from "@/data/erp/dashboard";
import { cashFlow, financeSummary, profitAndLoss } from "@/data/erp/finance";
import { supplierInvoices } from "@/data/erp/procurement";
import { invoices } from "@/data/erp/sales";
import { formatMoney, formatNumber } from "@/lib/erp/format";

const AGE_BUCKETS = ["Current", "30 days", "60 days", "90 days", "120+ days"];

function bucketFor(index: number) {
  return AGE_BUCKETS[index % AGE_BUCKETS.length];
}

export default function FinanceReportsPage() {
  const receivablesAgeing = AGE_BUCKETS.map((bucket) => ({
    bucket,
    amount: invoices
      .filter((invoice, index) => invoice.balanceDue > 0 && bucketFor(index) === bucket)
      .reduce((sum, invoice) => sum + invoice.balanceDue, 0),
  }));

  const payablesAgeing = AGE_BUCKETS.map((bucket) => ({
    bucket,
    amount: supplierInvoices
      .filter((invoice, index) => invoice.amount - invoice.amountPaid > 0 && bucketFor(index) === bucket)
      .reduce((sum, invoice) => sum + (invoice.amount - invoice.amountPaid), 0),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance Reports"
        description="Statutory statements, ageing analysis and expense reporting for the current financial year."
        breadcrumbs={[{ label: "Reports", href: "/reports" }, { label: "Finance" }]}
        actions={
          <>
            <PrintButton label="Print report" />
            <DemoActionButton size="sm" message="Export prepared for demonstration." description="A finance pack preview was generated.">
              Export report
            </DemoActionButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Revenue" value={formatMoney(financeSummary.revenue)} change={12.4} />
        <KpiCard label="Net profit" value={formatMoney(financeSummary.netProfit)} change={9.7} />
        <KpiCard label="Receivables" value={formatMoney(financeSummary.accountsReceivable)} change={-5.4} />
        <KpiCard label="Payables" value={formatMoney(financeSummary.accountsPayable)} change={3.6} />
      </section>

      <SectionCard title="Financial statements" description="Open the full statement views.">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { href: "/reports/profit-loss", label: "Profit & Loss Statement" },
            { href: "/reports/balance-sheet", label: "Balance Sheet" },
            { href: "/reports/cash-flow", label: "Cash Flow Statement" },
          ].map((entry) => (
            <Button key={entry.href} asChild variant="outline" className="justify-between">
              <Link prefetch={false} href={entry.href}>
                {entry.label}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          ))}
        </div>
      </SectionCard>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Aged receivables" description="Customer balances by ageing bucket.">
          <ErpBarChart data={receivablesAgeing} xKey="bucket" money series={[{ key: "amount", label: "Balance" }]} height={250} />
        </ChartCard>
        <ChartCard title="Aged payables" description="Supplier balances by ageing bucket.">
          <ErpBarChart data={payablesAgeing} xKey="bucket" money series={[{ key: "amount", label: "Balance" }]} height={250} />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Profit by month" description="Revenue, expenses and profit." className="lg:col-span-2">
          <ErpBarChart
            data={profitAndLoss.monthly}
            xKey="month"
            money
            series={[
              { key: "revenue", label: "Revenue" },
              { key: "expenses", label: "Expenses" },
              { key: "profit", label: "Profit" },
            ]}
            height={250}
          />
        </ChartCard>
        <ChartCard title="Expense mix" description="Operating expense categories.">
          <ErpPieChart data={expenseBreakdown.slice(0, 6).map((entry) => ({ name: entry.category, value: entry.amount }))} />
        </ChartCard>
      </section>

      <SectionCard title="Overdue receivables register" description="Invoices past their due date.">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices
                .filter((invoice) => invoice.status === "Overdue")
                .slice(0, 12)
                .map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Link prefetch={false} href={`/invoices/${invoice.id}`} className="text-primary hover:underline">
                        {invoice.reference}
                      </Link>
                    </TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.dueDate}</TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatMoney(invoice.balanceDue, invoice.currency)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Cash position" description={`Closing cash for ${cashFlow.period}.`}>
        <p className="text-muted-foreground text-sm">
          Opening cash of {formatMoney(cashFlow.openingCash)} moved across {formatNumber(cashFlow.operating.length + cashFlow.investing.length + cashFlow.financing.length)}{" "}
          reported activities during the period. Open the cash flow statement for the full reconciliation.
        </p>
      </SectionCard>
    </div>
  );
}
