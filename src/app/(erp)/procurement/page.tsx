import Link from "next/link";

import { ArrowRight, Building2, ClipboardCheck, FileStack, PackageCheck, ReceiptText, Wallet } from "lucide-react";

import { ChartCard, ErpBarChart, ErpLineChart, ErpPieChart } from "@/components/erp/charts";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { procurementSpend } from "@/data/erp/dashboard";
import { goodsReceipts, purchaseOrders, purchaseRequests, supplierInvoices } from "@/data/erp/procurement";
import { suppliers } from "@/data/erp/suppliers";
import { formatDate, formatMoney, formatMoneyCompact, formatNumber } from "@/lib/erp/format";

export default function ProcurementOverviewPage() {
  const spend = purchaseOrders.reduce((sum, order) => sum + order.total, 0);
  const openOrders = purchaseOrders.filter((order) => !["Received", "Cancelled"].includes(order.status));
  const pendingApprovals = purchaseRequests.filter(
    (request) => request.status === "Submitted" || request.status === "Under Review",
  );
  const outstandingSupplierInvoices = supplierInvoices.filter((invoice) => invoice.status !== "Paid");

  const spendBySupplier = [...suppliers]
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 8)
    .map((supplier) => ({ supplier: supplier.name.replace(" (Pty) Ltd", ""), spend: supplier.totalSpend }));

  const spendByCategory = Array.from(
    purchaseOrders.reduce((map, order) => {
      map.set(order.category, (map.get(order.category) ?? 0) + order.total);
      return map;
    }, new Map<string, number>()),
  ).map(([name, value]) => ({ name, value: Math.round(value) }));

  const statusSplit = Array.from(
    purchaseOrders.reduce((map, order) => {
      map.set(order.status, (map.get(order.status) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  ).map(([status, count]) => ({ status, count }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement Overview"
        description="Supplier spend, order pipeline, receipting performance and payables exposure."
        breadcrumbs={[{ label: "Procurement", href: "/procurement" }, { label: "Overview" }]}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link prefetch={false} href="/reports/procurement">
              Procurement reports
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Purchase spend" value={formatMoney(spend)} change={6.2} icon={Wallet} />
        <KpiCard
          label="Open purchase orders"
          value={formatNumber(openOrders.length)}
          hint="Awaiting receipt"
          icon={FileStack}
        />
        <KpiCard
          label="Pending approvals"
          value={formatNumber(pendingApprovals.length)}
          hint="Purchase requests"
          icon={ClipboardCheck}
        />
        <KpiCard
          label="Active suppliers"
          value={formatNumber(suppliers.filter((supplier) => supplier.status === "Active").length)}
          hint={`${suppliers.length} on the vendor master`}
          icon={Building2}
        />
        <KpiCard
          label="Goods received"
          value={formatNumber(goodsReceipts.filter((receipt) => receipt.status === "Completed").length)}
          hint="Completed receipts"
          icon={PackageCheck}
        />
        <KpiCard
          label="Outstanding invoices"
          value={formatMoney(
            outstandingSupplierInvoices.reduce((sum, invoice) => sum + (invoice.amount - invoice.amountPaid), 0),
          )}
          hint={`${outstandingSupplierInvoices.length} supplier invoices`}
          icon={ReceiptText}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Monthly procurement spend"
          description="Committed spend across all categories."
          className="lg:col-span-2"
        >
          <ErpLineChart data={procurementSpend} xKey="month" money series={[{ key: "spend", label: "Spend" }]} />
        </ChartCard>
        <ChartCard title="Spend by category" description="Category concentration of committed spend.">
          <ErpPieChart data={spendByCategory} />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Spend by supplier" description="Top suppliers by lifetime spend.">
          <ErpBarChart
            data={spendBySupplier}
            xKey="supplier"
            money
            series={[{ key: "spend", label: "Spend" }]}
            height={280}
          />
        </ChartCard>
        <ChartCard title="Purchase order status" description="Distribution of the current order book.">
          <ErpBarChart data={statusSplit} xKey="status" series={[{ key: "count", label: "Orders" }]} height={280} />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Purchase orders awaiting action"
          description="Orders pending approval, transmission or receipt."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/purchase-orders">
                All orders
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {openOrders.slice(0, 8).map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <Link
                    prefetch={false}
                    href={`/purchase-orders/${order.id}`}
                    className="font-medium text-sm hover:underline"
                  >
                    {order.reference}
                  </Link>
                  <p className="truncate text-muted-foreground text-xs">
                    {order.supplierName} · expected {formatDate(order.expectedDate)}
                  </p>
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

        <SectionCard
          title="Recent goods receipts"
          description="Deliveries booked into the warehouse network."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/goods-receipts">
                All receipts
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {goodsReceipts.slice(0, 8).map((receipt) => (
              <li key={receipt.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="font-medium text-sm">{receipt.reference}</p>
                  <p className="truncate text-muted-foreground text-xs">
                    {receipt.supplierName} · {receipt.warehouseName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={receipt.status} />
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {formatNumber(receipt.quantityReceived)}/{formatNumber(receipt.quantityOrdered)}
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
