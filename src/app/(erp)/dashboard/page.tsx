import Link from "next/link";

import {
  AlertTriangle,
  Banknote,
  Boxes,
  FileStack,
  PackageSearch,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import {
  ChartCard,
  ErpAreaChart,
  ErpBarChart,
  ErpLineChart,
  ErpPieChart,
  ProgressMeter,
} from "@/components/erp/charts";
import { DemoActionButton } from "@/components/erp/demo-actions";
import { SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import {
  dashboardKpis,
  dashboardLowStock,
  expenseBreakdown,
  inventoryDistribution,
  operationsSnapshot,
  orderStatusBreakdown,
  outstandingInvoiceList,
  pendingPurchaseOrders,
  procurementSpend,
  recentOrders,
  revenueByCategory,
  revenueTrend,
  salesPerformance,
  topCustomers,
  topProducts,
} from "@/data/erp/dashboard";
import { hrSummary } from "@/data/erp/hr";
import { logisticsSummary, upcomingDeliveries } from "@/data/erp/logistics";
import { activityFeed } from "@/data/erp/notifications";
import { warehouses } from "@/data/erp/organisation";
import { projectSummary, projects } from "@/data/erp/projects";
import { formatDate, formatMoney, formatMoneyCompact, formatNumber, formatPercent } from "@/lib/erp/format";

export const metadata: Metadata = {
  title: "Enterprise Overview — Dimension ERP",
  description: "Group-wide operational, commercial and financial overview for the Dimension ERP demonstration.",
};

export default function DashboardPage() {
  const activeProjects = projects
    .filter((project) => project.status === "Active" || project.status === "At Risk")
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Overview"
        description="Consolidated performance across sales, procurement, inventory, finance, people and logistics for Dimension Holdings — 30 June 2026."
        breadcrumbs={[{ label: "Dimension ERP", href: "/dashboard" }, { label: "Dashboard" }]}
        actions={
          <>
            <DemoActionButton
              variant="outline"
              size="sm"
              message="Report filters updated."
              description="The overview now reflects the current financial period."
            >
              Current period
            </DemoActionButton>
            <DemoActionButton
              size="sm"
              message="Export prepared for demonstration."
              description="An executive pack preview was generated in the interface only."
            >
              Export overview
            </DemoActionButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Revenue (YTD)"
          value={formatMoney(dashboardKpis.revenue)}
          change={dashboardKpis.revenueChange}
          icon={TrendingUp}
        />
        <KpiCard
          label="Orders"
          value={formatNumber(dashboardKpis.orders)}
          change={dashboardKpis.ordersChange}
          icon={ShoppingCart}
        />
        <KpiCard
          label="Active customers"
          value={formatNumber(dashboardKpis.customers)}
          change={dashboardKpis.customersChange}
          icon={Users}
        />
        <KpiCard
          label="Inventory value"
          value={formatMoney(dashboardKpis.inventoryValue)}
          change={dashboardKpis.inventoryChange}
          icon={Boxes}
        />
        <KpiCard
          label="Open purchase orders"
          value={formatNumber(dashboardKpis.purchaseOrders)}
          change={dashboardKpis.purchaseOrdersChange}
          icon={FileStack}
        />
        <KpiCard
          label="Outstanding invoices"
          value={formatMoney(dashboardKpis.outstandingInvoices)}
          change={dashboardKpis.outstandingChange}
          icon={ReceiptText}
        />
        <KpiCard
          label="Operating expenses"
          value={formatMoney(dashboardKpis.operatingExpenses)}
          change={dashboardKpis.expensesChange}
          icon={Wallet}
        />
        <KpiCard
          label="Net profit"
          value={formatMoney(dashboardKpis.netProfit)}
          change={dashboardKpis.netProfitChange}
          icon={Banknote}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Revenue overview"
          description="Monthly revenue against target and the prior year, in ZAR."
          className="lg:col-span-2"
        >
          <ErpAreaChart
            data={revenueTrend}
            xKey="month"
            money
            series={[
              { key: "revenue", label: "Revenue" },
              { key: "target", label: "Target" },
              { key: "lastYear", label: "Prior year" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Revenue by category" description="Contribution by product category.">
          <ErpPieChart data={revenueByCategory.map((entry) => ({ name: entry.category, value: entry.revenue }))} />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Sales performance" description="Revenue by sales channel.">
          <ErpBarChart
            data={salesPerformance}
            xKey="channel"
            money
            series={[{ key: "revenue", label: "Revenue" }]}
            height={240}
          />
        </ChartCard>
        <ChartCard title="Order status" description="Distribution of orders across the fulfilment pipeline.">
          <ErpPieChart
            data={orderStatusBreakdown.map((entry) => ({ name: entry.status, value: entry.count }))}
            height={240}
          />
        </ChartCard>
        <ChartCard title="Inventory distribution" description="Stock value by product category.">
          <ErpBarChart
            data={inventoryDistribution}
            xKey="category"
            money
            series={[{ key: "value", label: "Stock value" }]}
            height={240}
          />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Procurement spend" description="Monthly committed spend across all supplier categories.">
          <ErpLineChart
            data={procurementSpend}
            xKey="month"
            money
            series={[{ key: "spend", label: "Spend" }]}
            height={240}
          />
        </ChartCard>
        <ChartCard title="Expense overview" description="Claimed operating expenses by category.">
          <ErpBarChart
            data={expenseBreakdown.slice(0, 8)}
            xKey="category"
            money
            series={[{ key: "amount", label: "Expenses" }]}
            height={240}
          />
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Recent orders"
          description="The latest sales orders captured across all channels."
          className="xl:col-span-2"
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/orders">
                View all orders
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <Link prefetch={false} href={`/orders/${order.id}`} className="font-medium text-sm hover:underline">
                    {order.reference}
                  </Link>
                  <p className="truncate text-muted-foreground text-xs">
                    {order.customerName} · {formatDate(order.orderDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="font-medium text-sm tabular-nums">{formatMoney(order.total, order.currency)}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Recent activity" description="Actions recorded across the platform.">
          <ActivityTimeline
            events={activityFeed.slice(0, 6).map((entry) => ({
              id: entry.id,
              title: `${entry.actor} ${entry.action} ${entry.target}`,
              description: `${entry.module} module`,
              timestamp: entry.timestamp,
              actor: entry.module,
              tone: entry.tone,
            }))}
          />
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Low stock items"
          description="Products at or below their reorder level."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/stock-levels">
                Stock levels
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {dashboardLowStock.map((record) => (
              <li key={record.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm">{record.productName}</p>
                  <p className="truncate text-muted-foreground text-xs">
                    {record.sku} · {record.warehouseName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs tabular-nums">{record.available} avail.</span>
                  <StatusBadge status={record.status} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Outstanding invoices"
          description="Largest balances awaiting settlement."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/invoices">
                Invoices
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {outstandingInvoiceList.map((invoice) => (
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
                <div className="flex items-center gap-2">
                  <StatusBadge status={invoice.status} />
                  <span className="font-medium text-sm tabular-nums">
                    {formatMoney(invoice.balanceDue, invoice.currency)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Pending purchase orders"
          description="Orders awaiting approval, transmission or receipt."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/purchase-orders">
                Purchase orders
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {pendingPurchaseOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <Link
                    prefetch={false}
                    href={`/purchase-orders/${order.id}`}
                    className="font-medium text-sm hover:underline"
                  >
                    {order.reference}
                  </Link>
                  <p className="truncate text-muted-foreground text-xs">{order.supplierName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  <span className="font-medium text-sm tabular-nums">
                    {formatMoneyCompact(order.total, order.currency)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Top products" description="Ranked by trailing twelve month revenue.">
          <ul className="divide-y">
            {topProducts.map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <Link
                    prefetch={false}
                    href={`/products/${product.id}`}
                    className="truncate font-medium text-sm hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="truncate text-muted-foreground text-xs">
                    {product.sku} · {formatNumber(product.units)} units
                  </p>
                </div>
                <span className="font-medium text-sm tabular-nums">{formatMoneyCompact(product.revenue)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Top customers" description="Ranked by lifetime revenue.">
          <ul className="divide-y">
            {topCustomers.map((customer) => (
              <li key={customer.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <Link
                    prefetch={false}
                    href={`/customers/${customer.id}`}
                    className="truncate font-medium text-sm hover:underline"
                  >
                    {customer.tradingName}
                  </Link>
                  <p className="truncate text-muted-foreground text-xs">
                    {customer.segment} · {customer.totalOrders} orders
                  </p>
                </div>
                <span className="font-medium text-sm tabular-nums">{formatMoneyCompact(customer.totalRevenue)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Upcoming deliveries" description="Scheduled and in-progress delivery runs.">
          <ul className="divide-y">
            {upcomingDeliveries.map((delivery) => (
              <li key={delivery.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm">{delivery.reference}</p>
                  <p className="truncate text-muted-foreground text-xs">
                    {delivery.customerName} · {delivery.timeWindow}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={delivery.status} />
                  <span className="text-muted-foreground text-xs">{formatDate(delivery.scheduledDate)}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Employee overview" description="Workforce position across the group.">
          <div className="space-y-1">
            <StatRow label="Total employees" value={formatNumber(hrSummary.totalEmployees)} />
            <StatRow label="New hires (quarter)" value={formatNumber(hrSummary.newHires)} />
            <StatRow label="Open positions" value={formatNumber(hrSummary.openPositions)} />
            <StatRow label="Pending leave requests" value={formatNumber(hrSummary.pendingLeave)} />
            <StatRow label="Attendance rate" value={formatPercent(hrSummary.attendanceRate)} />
            <StatRow
              label="Average salary"
              value={formatMoney(hrSummary.averageSalary)}
              hint="Monthly, all departments"
            />
          </div>
        </SectionCard>

        <SectionCard title="Project status" description="Delivery portfolio health.">
          <ul className="space-y-3">
            {activeProjects.map((project) => (
              <li key={project.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    prefetch={false}
                    href={`/projects/${project.id}`}
                    className="truncate font-medium text-sm hover:underline"
                  >
                    {project.name}
                  </Link>
                  <StatusBadge status={project.status} />
                </div>
                <ProgressMeter
                  label={project.manager}
                  value={project.progress}
                  max={100}
                  hint={`${project.progress}%`}
                />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Operations snapshot" description="Service levels and capacity utilisation.">
          <div className="space-y-4">
            <div className="space-y-1">
              <StatRow label="Order fulfilment rate" value={formatPercent(operationsSnapshot.fulfilmentRate)} />
              <StatRow label="On-time delivery" value={formatPercent(operationsSnapshot.onTimeDelivery)} />
              <StatRow label="Average order value" value={formatMoney(operationsSnapshot.averageOrderValue)} />
              <StatRow label="Shipments in transit" value={formatNumber(logisticsSummary.inTransit)} />
              <StatRow label="Projects at risk" value={formatNumber(projectSummary.atRisk)} />
            </div>
            <div className="space-y-3 border-t pt-3">
              {warehouses.map((warehouse) => (
                <ProgressMeter
                  key={warehouse.id}
                  label={warehouse.name}
                  value={warehouse.utilization}
                  max={100}
                  hint={`${warehouse.utilization}% utilised`}
                />
              ))}
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <p className="font-medium text-sm">Demo data notice</p>
            <p className="text-muted-foreground text-sm">
              Dimension ERP is a frontend-only demonstration. Every figure on this dashboard is fictional mock data held
              in local TypeScript files — no database, authentication provider or external business system is connected.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link prefetch={false} href="/platform-overview">
                <PackageSearch data-icon="inline-start" />
                Read the platform overview
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
