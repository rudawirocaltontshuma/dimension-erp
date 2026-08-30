import Link from "next/link";
import { notFound } from "next/navigation";

import { Package } from "lucide-react";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import { ChartCard, ErpBarChart, ErpLineChart, ProgressMeter } from "@/components/erp/charts";
import { DemoActionButton } from "@/components/erp/demo-actions";
import { InfoGrid, SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inventoryRecords, stockMovements } from "@/data/erp/inventory";
import { purchaseOrders } from "@/data/erp/procurement";
import { products } from "@/data/erp/products";
import { orders } from "@/data/erp/sales";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

const TABS = ["Overview", "Inventory", "Warehouses", "Sales", "Purchasing", "Activity"];

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((entry) => entry.id === id);
  if (!product) notFound();

  const records = inventoryRecords.filter((record) => record.productId === product.id);
  const movements = stockMovements.filter((movement) => movement.productSku === product.sku).slice(0, 12);
  const relatedOrders = orders
    .filter((order) => order.items.some((item) => item.productId === product.id))
    .slice(0, 10);
  const relatedPurchaseOrders = purchaseOrders
    .filter((order) => order.items.some((item) => item.productId === product.id))
    .slice(0, 10);
  const annualUnits = product.monthlySales.reduce((sum, entry) => sum + entry.units, 0);
  const annualRevenue = product.monthlySales.reduce((sum, entry) => sum + entry.revenue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        description={`${product.sku} · ${product.category} / ${product.subCategory} · supplied by ${product.supplierName}`}
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Products", href: "/products" },
          { label: product.sku },
        ]}
        meta={
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={product.status} />
            <span className="text-muted-foreground text-xs">Barcode {product.barcode}</span>
          </div>
        }
        actions={
          <DemoActionButton
            size="sm"
            message="Demo changes applied."
            description={`A replenishment suggestion was prepared for ${product.sku}.`}
          >
            Suggest replenishment
          </DemoActionButton>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Selling price" value={formatMoney(product.price)} hint={`Cost ${formatMoney(product.cost)}`} />
        <KpiCard label="Gross margin" value={formatPercent(product.margin)} hint="Standard costing basis" />
        <KpiCard
          label="Stock on hand"
          value={formatNumber(product.stockOnHand)}
          hint={`${formatNumber(product.available)} available`}
        />
        <KpiCard
          label="Annual revenue"
          value={formatMoney(annualRevenue)}
          hint={`${formatNumber(annualUnits)} units sold`}
        />
      </section>

      <Tabs defaultValue="Overview" className="space-y-4">
        <div className="w-full overflow-x-auto">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="Overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/40 p-10">
              <div className="text-center text-muted-foreground">
                <Package aria-hidden className="mx-auto size-10" />
                <p className="mt-2 text-sm">Product image placeholder</p>
                <p className="text-xs">Imagery is omitted in this demonstration dataset.</p>
              </div>
            </div>
            <SectionCard title="Product details" className="lg:col-span-2">
              <InfoGrid
                columns={3}
                items={[
                  { label: "SKU", value: product.sku },
                  { label: "Category", value: product.category },
                  { label: "Sub category", value: product.subCategory },
                  { label: "Brand", value: product.brand },
                  {
                    label: "Supplier",
                    value: (
                      <Link
                        prefetch={false}
                        href={`/suppliers/${product.supplierId}`}
                        className="text-primary hover:underline"
                      >
                        {product.supplierName}
                      </Link>
                    ),
                  },
                  { label: "Unit of measure", value: product.unit },
                  { label: "Lead time", value: `${product.leadTimeDays} days` },
                  { label: "Weight", value: `${product.weightKg} kg` },
                  { label: "Tax rate", value: formatPercent(product.taxRate, 0) },
                  { label: "Reorder level", value: formatNumber(product.reorderLevel) },
                  { label: "Reorder quantity", value: formatNumber(product.reorderQuantity) },
                  { label: "Listed since", value: formatDate(product.createdAt) },
                ]}
              />
            </SectionCard>
          </div>
          <SectionCard title="Description">
            <p className="text-muted-foreground text-sm">{product.description}</p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Inventory" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard title="Stock position">
              <div className="space-y-1">
                <StatRow label="On hand" value={formatNumber(product.stockOnHand)} />
                <StatRow label="Reserved" value={formatNumber(product.reserved)} />
                <StatRow label="Available" value={formatNumber(product.available)} />
                <StatRow label="Reorder level" value={formatNumber(product.reorderLevel)} />
                <StatRow label="Stock value" value={formatMoney(product.stockOnHand * product.cost)} />
              </div>
            </SectionCard>
            <SectionCard
              title="Stock movements"
              className="lg:col-span-2"
              description="The most recent movements for this SKU."
            >
              <div className="w-full overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="font-medium">{movement.reference}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(movement.date)}</TableCell>
                        <TableCell className="text-muted-foreground">{movement.warehouseName}</TableCell>
                        <TableCell>
                          <StatusBadge status={movement.type} tone="info" />
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{formatNumber(movement.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="Warehouses">
          <SectionCard
            title="Warehouse distribution"
            description="Stock held for this product at each distribution point."
          >
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="space-y-2 rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-sm">{record.warehouseName}</p>
                    <StatusBadge status={record.status} />
                  </div>
                  <ProgressMeter
                    label={`Bin ${record.binLocation}`}
                    value={record.available}
                    max={Math.max(record.onHand, record.reorderLevel * 4)}
                    hint={`${formatNumber(record.available)} available of ${formatNumber(record.onHand)} on hand`}
                  />
                  <p className="text-muted-foreground text-xs">
                    Reserved {formatNumber(record.reserved)} · Stock value {formatMoney(record.stockValue)} · Last
                    counted {formatDate(record.lastCountedAt)}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Sales" className="space-y-4">
          <ChartCard title="Sales trend" description="Units and revenue over the trailing twelve months.">
            <ErpLineChart
              data={product.monthlySales.map((entry) => ({
                month: entry.month,
                units: entry.units,
                revenue: entry.revenue,
              }))}
              xKey="month"
              series={[
                { key: "units", label: "Units" },
                { key: "revenue", label: "Revenue" },
              ]}
            />
          </ChartCard>
          <SectionCard title="Recent orders containing this product">
            <ul className="divide-y">
              {relatedOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link prefetch={false} href={`/orders/${order.id}`} className="font-medium text-sm hover:underline">
                      {order.reference}
                    </Link>
                    <p className="truncate text-muted-foreground text-xs">
                      {order.customerName} · {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Purchasing" className="space-y-4">
          <ChartCard title="Monthly purchase volume" description="Indicative replenishment volumes for this SKU.">
            <ErpBarChart
              data={product.monthlySales.map((entry) => ({
                month: entry.month,
                units: Math.round(entry.units * 0.82),
              }))}
              xKey="month"
              series={[{ key: "units", label: "Units purchased" }]}
              height={240}
            />
          </ChartCard>
          <SectionCard title="Purchase orders" description="Supplier orders including this product.">
            <ul className="divide-y">
              {relatedPurchaseOrders.map((order) => (
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
                  <StatusBadge status={order.status} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Activity">
          <SectionCard title="Product activity">
            <ActivityTimeline
              events={[
                {
                  id: `${product.id}-t1`,
                  title: "Price list updated",
                  description: `Selling price confirmed at ${formatMoney(product.price)} for the current trading period.`,
                  timestamp: "2026-06-20T08:30:00.000Z",
                  actor: "Commercial",
                  tone: "info",
                },
                {
                  id: `${product.id}-t2`,
                  title: "Cycle count completed",
                  description: "Physical count reconciled against the system quantity with no variance.",
                  timestamp: "2026-06-12T14:10:00.000Z",
                  actor: "Warehouse Operations",
                  tone: "success",
                },
                {
                  id: `${product.id}-t3`,
                  title: "Supplier lead time revised",
                  description: `${product.supplierName} confirmed a ${product.leadTimeDays} day replenishment lead time.`,
                  timestamp: "2026-05-28T10:00:00.000Z",
                  actor: "Procurement",
                  tone: "warning",
                },
              ]}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
