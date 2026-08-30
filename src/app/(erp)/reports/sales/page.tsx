import Link from "next/link";

import { ChartCard, ErpBarChart, ErpLineChart, ErpPieChart } from "@/components/erp/charts";
import { DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { revenueByCategory, revenueTrend, salesPerformance, topCustomers, topProducts } from "@/data/erp/dashboard";
import { invoices, orders, quotes } from "@/data/erp/sales";
import { formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export default function SalesReportsPage() {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const accepted = quotes.filter((quote) => quote.status === "Accepted").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Reports"
        description="Commercial analysis covering revenue, channels, categories, customers and quotation conversion."
        breadcrumbs={[{ label: "Reports", href: "/reports" }, { label: "Sales" }]}
        actions={
          <>
            <PrintButton label="Print report" />
            <DemoActionButton
              size="sm"
              message="Export prepared for demonstration."
              description="A sales pack preview was generated in the interface."
            >
              Export report
            </DemoActionButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Revenue" value={formatMoney(revenue)} change={12.4} />
        <KpiCard label="Orders" value={formatNumber(orders.length)} change={8.1} />
        <KpiCard label="Average order value" value={formatMoney(revenue / orders.length)} change={3.9} />
        <KpiCard label="Quote conversion" value={formatPercent((accepted / quotes.length) * 100)} change={2.4} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue trend" description="Monthly revenue against target." className="lg:col-span-2">
          <ErpLineChart
            data={revenueTrend}
            xKey="month"
            money
            series={[
              { key: "revenue", label: "Revenue" },
              { key: "lastYear", label: "Prior year" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Revenue by category" description="Category contribution.">
          <ErpPieChart data={revenueByCategory.map((entry) => ({ name: entry.category, value: entry.revenue }))} />
        </ChartCard>
      </section>

      <ChartCard title="Channel performance" description="Revenue and order volume by route to market.">
        <ErpBarChart
          data={salesPerformance}
          xKey="channel"
          money
          series={[{ key: "revenue", label: "Revenue" }]}
          height={260}
        />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Top products by revenue">
          <div className="w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Link prefetch={false} href={`/products/${product.id}`} className="text-primary hover:underline">
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(product.units)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatMoney(product.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard title="Customer revenue ranking">
          <div className="w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Link
                        prefetch={false}
                        href={`/customers/${customer.id}`}
                        className="text-primary hover:underline"
                      >
                        {customer.tradingName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={customer.segment} tone="info" />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(customer.totalOrders)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatMoney(customer.totalRevenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Invoicing summary" description="Invoiced value and settlement status for the period.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(["Paid", "Sent", "Partially Paid", "Overdue"] as const).map((status) => {
            const rows = invoices.filter((invoice) => invoice.status === status);
            return (
              <div key={status} className="rounded-lg border p-4">
                <StatusBadge status={status} />
                <p className="mt-2 font-semibold text-lg tabular-nums">
                  {formatMoney(rows.reduce((sum, invoice) => sum + invoice.total, 0))}
                </p>
                <p className="text-muted-foreground text-xs">{rows.length} invoices</p>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
