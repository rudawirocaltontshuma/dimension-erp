import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import { ProgressMeter } from "@/components/erp/charts";
import { DemoActionButton } from "@/components/erp/demo-actions";
import { InfoGrid, SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { purchaseOrders, supplierInvoices } from "@/data/erp/procurement";
import { products } from "@/data/erp/products";
import { suppliers } from "@/data/erp/suppliers";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export function generateStaticParams() {
  return suppliers.map((supplier) => ({ id: supplier.id }));
}

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = suppliers.find((entry) => entry.id === id);
  if (!supplier) notFound();

  const orders = purchaseOrders.filter((order) => order.supplierId === supplier.id);
  const invoices = supplierInvoices.filter((invoice) => invoice.supplierName === supplier.name);
  const suppliedProducts = products.filter((product) => product.supplierId === supplier.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={supplier.name}
        description={`${supplier.category} · ${supplier.city}, ${supplier.country} · ${supplier.paymentTerms}`}
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "Suppliers", href: "/suppliers" },
          { label: supplier.id },
        ]}
        meta={
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={supplier.status} />
            <span className="text-muted-foreground text-xs">Onboarded {formatDate(supplier.onboardedAt)}</span>
          </div>
        }
        actions={
          <DemoActionButton
            size="sm"
            message="Demo changes applied."
            description="A supplier scorecard review was scheduled."
          >
            Schedule review
          </DemoActionButton>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Lifetime spend"
          value={formatMoney(supplier.totalSpend, supplier.currency)}
          hint={`${supplier.totalOrders} purchase orders`}
        />
        <KpiCard
          label="On-time delivery"
          value={formatPercent(supplier.onTimeDeliveryRate)}
          hint="Rolling twelve months"
        />
        <KpiCard label="Quality score" value={`${supplier.qualityScore} / 5.0`} hint="Goods receipt inspections" />
        <KpiCard label="Lead time" value={`${supplier.leadTimeDays} days`} hint="Confirmed replenishment window" />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Supplier details" className="lg:col-span-2">
          <InfoGrid
            columns={3}
            items={[
              { label: "Supplier ID", value: supplier.id },
              { label: "Category", value: supplier.category },
              { label: "Primary contact", value: supplier.contactName },
              { label: "Email", value: supplier.email },
              { label: "Telephone", value: supplier.phone },
              { label: "VAT number", value: supplier.vatNumber },
              { label: "Currency", value: supplier.currency },
              { label: "Payment terms", value: supplier.paymentTerms },
              { label: "Address", value: `${supplier.address.line1}, ${supplier.address.city}` },
            ]}
          />
        </SectionCard>
        <SectionCard title="Performance">
          <div className="space-y-4">
            <ProgressMeter label="On-time delivery" value={supplier.onTimeDeliveryRate} max={100} />
            <ProgressMeter
              label="Quality score"
              value={supplier.qualityScore}
              max={5}
              hint={`${supplier.qualityScore} / 5.0`}
            />
            <div className="space-y-1">
              <StatRow
                label="Open orders"
                value={formatNumber(orders.filter((order) => order.status !== "Received").length)}
              />
              <StatRow label="Supplier invoices" value={formatNumber(invoices.length)} />
              <StatRow label="Products supplied" value={formatNumber(suppliedProducts.length)} />
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Purchase orders" description="Orders raised against this supplier.">
          <ul className="divide-y">
            {orders.slice(0, 10).map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <Link
                    prefetch={false}
                    href={`/purchase-orders/${order.id}`}
                    className="font-medium text-sm hover:underline"
                  >
                    {order.reference}
                  </Link>
                  <p className="text-muted-foreground text-xs">Expected {formatDate(order.expectedDate)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  <span className="text-sm tabular-nums">{formatMoney(order.total, order.currency)}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Products supplied" description="Catalogue lines sourced from this supplier.">
          <ul className="divide-y">
            {suppliedProducts.slice(0, 10).map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <Link
                    prefetch={false}
                    href={`/products/${product.id}`}
                    className="font-medium text-sm hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-muted-foreground text-xs">{product.sku}</p>
                </div>
                <span className="text-sm tabular-nums">{formatMoney(product.cost)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Supplier activity">
        <ActivityTimeline
          events={[
            {
              id: `${supplier.id}-s1`,
              title: "Scorecard reviewed",
              description: `On-time delivery recorded at ${formatPercent(supplier.onTimeDeliveryRate)} with a quality score of ${supplier.qualityScore}.`,
              timestamp: "2026-06-22T10:00:00.000Z",
              actor: "Procurement Governance",
              tone: supplier.onTimeDeliveryRate > 90 ? "success" : "warning",
            },
            {
              id: `${supplier.id}-s2`,
              title: "Pricing agreement renewed",
              description: `Commercial terms confirmed as ${supplier.paymentTerms} in ${supplier.currency}.`,
              timestamp: "2026-05-14T09:30:00.000Z",
              actor: "Category Buyer",
              tone: "info",
            },
            {
              id: `${supplier.id}-s3`,
              title: "Supplier onboarded",
              description: `Added to the vendor master on ${formatDate(supplier.onboardedAt)}.`,
              timestamp: "2026-01-08T08:00:00.000Z",
              actor: "Procurement",
              tone: "neutral",
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
