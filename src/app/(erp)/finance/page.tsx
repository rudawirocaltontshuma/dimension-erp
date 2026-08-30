import Link from "next/link";

import { ArrowRight, Banknote, Coins, PiggyBank, ReceiptText, TrendingDown, Wallet } from "lucide-react";

import { ChartCard, ErpBarChart, ErpLineChart, ErpPieChart } from "@/components/erp/charts";
import { SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { expenseBreakdown, revenueTrend } from "@/data/erp/dashboard";
import { cashFlow, financeSummary, profitAndLoss, transactions } from "@/data/erp/finance";
import { invoices } from "@/data/erp/sales";
import { formatDate, formatMoney, formatNumber } from "@/lib/erp/format";

export default function FinanceOverviewPage() {
  const recentTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "Overdue").slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance Overview"
        description="Revenue, cost, profitability, cash position and working capital for the current financial year."
        breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Overview" }]}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link prefetch={false} href="/reports/finance">
              Financial reports
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Revenue" value={formatMoney(financeSummary.revenue)} change={12.4} icon={Banknote} />
        <KpiCard label="Total expenses" value={formatMoney(financeSummary.expenses)} change={5.2} icon={TrendingDown} />
        <KpiCard label="Net profit" value={formatMoney(financeSummary.netProfit)} change={9.7} icon={PiggyBank} />
        <KpiCard label="Cash position" value={formatMoney(financeSummary.cashPosition)} change={4.1} icon={Wallet} />
        <KpiCard
          label="Accounts receivable"
          value={formatMoney(financeSummary.accountsReceivable)}
          change={-5.4}
          icon={ReceiptText}
        />
        <KpiCard
          label="Accounts payable"
          value={formatMoney(financeSummary.accountsPayable)}
          change={3.6}
          icon={Coins}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Revenue and profitability"
          description="Monthly revenue trend in ZAR."
          className="lg:col-span-2"
        >
          <ErpLineChart
            data={revenueTrend}
            xKey="month"
            money
            series={[
              { key: "revenue", label: "Revenue" },
              { key: "target", label: "Budget" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Expense mix" description="Claimed operating expenses by category.">
          <ErpPieChart
            data={expenseBreakdown.slice(0, 6).map((entry) => ({ name: entry.category, value: entry.amount }))}
          />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Profit by month" description="Revenue, expenses and profit for the current financial year.">
          <ErpBarChart
            data={profitAndLoss.monthly}
            xKey="month"
            money
            series={[
              { key: "revenue", label: "Revenue" },
              { key: "expenses", label: "Expenses" },
              { key: "profit", label: "Profit" },
            ]}
            height={260}
          />
        </ChartCard>
        <ChartCard title="Cash movement" description="Cash inflow against outflow by month.">
          <ErpBarChart
            data={cashFlow.monthly}
            xKey="month"
            money
            series={[
              { key: "inflow", label: "Inflow" },
              { key: "outflow", label: "Outflow" },
            ]}
            height={260}
          />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Working capital">
          <div className="space-y-1">
            <StatRow label="Cash and equivalents" value={formatMoney(financeSummary.cashPosition)} />
            <StatRow label="Accounts receivable" value={formatMoney(financeSummary.accountsReceivable)} />
            <StatRow label="Accounts payable" value={formatMoney(financeSummary.accountsPayable)} />
            <StatRow label="VAT control" value={formatMoney(financeSummary.vatPayable)} />
            <StatRow label="Gross profit" value={formatMoney(financeSummary.grossProfit)} />
            <StatRow label="Operating expenses" value={formatMoney(financeSummary.operatingExpenses)} />
          </div>
        </SectionCard>

        <SectionCard
          title="Recent transactions"
          description="Latest postings from every module."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/transactions">
                All transactions
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {recentTransactions.map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm">{transaction.reference}</p>
                  <p className="truncate text-muted-foreground text-xs">
                    {transaction.category} · {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={transaction.status} />
                  <span className="text-sm tabular-nums">
                    {formatMoney(transaction.debit > 0 ? transaction.debit : transaction.credit)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Overdue receivables"
          description="Invoices past their due date."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/invoices">
                Invoices
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {overdueInvoices.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <Link
                    prefetch={false}
                    href={`/invoices/${invoice.id}`}
                    className="font-medium text-sm hover:underline"
                  >
                    {invoice.reference}
                  </Link>
                  <p className="truncate text-muted-foreground text-xs">
                    {invoice.customerName} · due {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <span className="text-sm tabular-nums">{formatMoney(invoice.balanceDue, invoice.currency)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </section>

      <SectionCard
        title="Ledger activity"
        description={`${formatNumber(transactions.length)} transactions posted in the current period.`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(["Posted", "Reconciled", "Pending", "Void"] as const).map((status) => (
            <div key={status} className="rounded-lg border p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">{status}</p>
              <p className="mt-1 font-semibold text-xl tabular-nums">
                {formatNumber(transactions.filter((transaction) => transaction.status === status).length)}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
