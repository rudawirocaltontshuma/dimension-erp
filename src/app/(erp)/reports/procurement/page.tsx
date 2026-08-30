import Link from "next/link";

import { ChartCard, ErpBarChart, ErpLineChart, ErpPieChart } from "@/components/erp/charts";
import { DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { procurementSpend } from "@/data/erp/dashboard";
import { goodsReceipts, purchaseOrders, supplierInvoices } from "@/data/erp/procurement";
import { suppliers } from "@/data/erp/suppliers";
import { formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export default function ProcurementReportsPage() {
  const spend = purchaseOrders.reduce((sum, order) => sum + order.total, 0);
  const topSuppliers = [...suppliers].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 10);
  const categorySpend = Array.from(
    purchaseOrders.reduce((map, order) => {
      map.set(order.category, (map.get(order.category) ?? 0) + order.total);
      return map;
    }, new Map<string, number>()),
  ).map(([name, value]) => ({ name, value: Math.round(value) }));

  const fillRate =
    (goodsReceipts.reduce((sum, receipt) => sum + receipt.quantityReceived, 0) /
      goodsReceipts.reduce((sum, receipt) => sum + receipt.quantityOrdered, 0)) *
    100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement Reports"
        description="Supplier spend concentration, delivery performance and payables analysis."
        breadcrumbs={[{ label: "Reports", href: "/reports" }, { label: "Procurement" }]}
        actions={
          <>
            <PrintButton label="Print report" />
            <DemoActionButton
              size="sm"
              message="Export prepared for demonstration."
              description="A procurement analysis pack preview was generated."
            >
              Export report
            </DemoActionButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Committed spend" value={formatMoney(spend)} change={6.2} />
        <KpiCard label="Purchase orders" value={formatNumber(purchaseOrders.length)} hint="Current period" />
        <KpiCard label="Receipt fill rate" value={formatPercent(fillRate)} hint="Received against ordered" />
        <KpiCard
          label="Payables outstanding"
          value={formatMoney(supplierInvoices.reduce((sum, invoice) => sum + (invoice.amount - invoice.amountPaid), 0))}
          hint="Supplier invoices"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Monthly spend" description="Committed procurement spend by month." className="lg:col-span-2">
          <ErpLineChart data={procurementSpend} xKey="month" money series={[{ key: "spend", label: "Spend" }]} />
        </ChartCard>
        <ChartCard title="Spend by category" description="Category concentration.">
          <ErpPieChart data={categorySpend} />
        </ChartCard>
      </section>

      <ChartCard title="Supplier spend" description="Top suppliers by lifetime spend.">
        <ErpBarChart
          data={topSuppliers.map((supplier) => ({
            supplier: supplier.name.replace(" (Pty) Ltd", ""),
            spend: supplier.totalSpend,
          }))}
          xKey="supplier"
          money
          series={[{ key: "spend", label: "Spend" }]}
          height={280}
        />
      </ChartCard>

      <SectionCard title="Supplier scorecard" description="Delivery and quality performance for the top suppliers.">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead className="text-right">On-time</TableHead>
                <TableHead className="text-right">Quality</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <Link prefetch={false} href={`/suppliers/${supplier.id}`} className="text-primary hover:underline">
                      {supplier.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{supplier.category}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(supplier.totalOrders)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(supplier.totalSpend, supplier.currency)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatPercent(supplier.onTimeDeliveryRate)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{supplier.qualityScore}</TableCell>
                  <TableCell>
                    <StatusBadge status={supplier.status} />
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
