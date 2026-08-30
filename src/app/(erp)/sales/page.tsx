import Link from "next/link";

import { ArrowRight, ReceiptText, RotateCcw, ShoppingCart, Target, TrendingUp, Users } from "lucide-react";

import { ChartCard, ErpAreaChart, ErpBarChart, ErpPieChart, ProgressMeter } from "@/components/erp/charts";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { revenueByCategory, revenueTrend, salesPerformance, topCustomers } from "@/data/erp/dashboard";
import { invoices, orders, quotes, salesReps } from "@/data/erp/sales";
import { formatMoney, formatMoneyCompact, formatNumber, formatPercent } from "@/lib/erp/format";

export default function SalesOverviewPage() {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = revenue / orders.length;
  const refunds = orders.filter((order) => order.paymentStatus === "Refunded").length;
  const outstanding = invoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0);
  const accepted = quotes.filter((quote) => quote.status === "Accepted").length;
  const conversion = (accepted / quotes.length) * 100;

  const repPerformance = salesReps.map((rep) => ({
    rep: rep.split(" ")[0],
    revenue: orders.filter((order) => order.salesRep === rep).reduce((sum, order) => sum + order.total, 0),
  }));

  const regions = Array.from(
    orders.reduce((map, order) => {
      const region = order.shippingAddress.province;
      map.set(region, (map.get(region) ?? 0) + order.total);
      return map;
    }, new Map<string, number>()),
  ).map(([region, value]) => ({ name: region, value: Math.round(value) }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Overview"
        description="Commercial performance across channels, regions, products and representatives."
        breadcrumbs={[{ label: "Sales", href: "/sales" }, { label: "Overview" }]}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link prefetch={false} href="/reports/sales">
              Sales reports
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Order revenue" value={formatMoney(revenue)} change={12.4} icon={TrendingUp} />
        <KpiCard label="Orders" value={formatNumber(orders.length)} change={8.1} icon={ShoppingCart} />
        <KpiCard label="Average order value" value={formatMoney(averageOrderValue)} change={3.9} icon={Target} />
        <KpiCard label="Quote conversion" value={formatPercent(conversion)} change={2.4} icon={Users} />
        <KpiCard label="Refunded orders" value={formatNumber(refunds)} change={-1.8} icon={RotateCcw} />
        <KpiCard label="Outstanding invoices" value={formatMoney(outstanding)} change={-5.4} icon={ReceiptText} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue trend" description="Monthly revenue against target." className="lg:col-span-2">
          <ErpAreaChart
            data={revenueTrend}
            xKey="month"
            money
            series={[
              { key: "revenue", label: "Revenue" },
              { key: "target", label: "Target" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Sales by region" description="Revenue by delivery province.">
          <ErpPieChart data={regions} />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Sales by product category" description="Revenue contribution per category.">
          <ErpBarChart
            data={revenueByCategory}
            xKey="category"
            money
            series={[{ key: "revenue", label: "Revenue" }]}
            height={240}
          />
        </ChartCard>
        <ChartCard title="Sales by channel" description="Revenue across routes to market.">
          <ErpBarChart
            data={salesPerformance}
            xKey="channel"
            money
            series={[{ key: "revenue", label: "Revenue" }]}
            height={240}
          />
        </ChartCard>
        <ChartCard title="Representative performance" description="Revenue captured per sales representative.">
          <ErpBarChart
            data={repPerformance}
            xKey="rep"
            money
            series={[{ key: "revenue", label: "Revenue" }]}
            height={240}
          />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Top customers"
          description="Highest lifetime revenue accounts."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/customers">
                All customers
              </Link>
            </Button>
          }
        >
          <div className="space-y-3">
            {topCustomers.map((customer) => (
              <ProgressMeter
                key={customer.id}
                label={customer.tradingName}
                value={customer.totalRevenue}
                max={topCustomers[0].totalRevenue}
                hint={formatMoneyCompact(customer.totalRevenue)}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Open quotes"
          description="Quotations awaiting a customer decision."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/quotes">
                All quotes
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {quotes
              .filter((quote) => quote.status === "Sent" || quote.status === "Viewed")
              .slice(0, 8)
              .map((quote) => (
                <li key={quote.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link prefetch={false} href={`/quotes/${quote.id}`} className="font-medium text-sm hover:underline">
                      {quote.reference}
                    </Link>
                    <p className="truncate text-muted-foreground text-xs">
                      {quote.customerName} · {quote.salesRep}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={quote.status} />
                    <span className="font-medium text-sm tabular-nums">
                      {formatMoneyCompact(quote.total, quote.currency)}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </SectionCard>
      </section>
    </div>
  );
}
