import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import { ConfirmDialog, DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { InfoGrid, SectionCard, StatRow } from "@/components/erp/detail-panels";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders } from "@/data/erp/sales";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export function generateStaticParams() {
  return orders.map((order) => ({ id: order.id }));
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = orders.find((entry) => entry.id === id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order ${order.reference}`}
        description={`${order.customerName} · captured ${formatDate(order.orderDate)} by ${order.salesRep}`}
        breadcrumbs={[
          { label: "Operations", href: "/dashboard" },
          { label: "Orders", href: "/orders" },
          { label: order.reference },
        ]}
        meta={
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={order.status} />
            <StatusBadge status={order.paymentStatus} />
            <StatusBadge status={order.fulfillmentStatus} />
          </div>
        }
        actions={
          <>
            <PrintButton label="Print order" />
            <DemoActionButton
              variant="outline"
              size="sm"
              message="Invoice preview opened."
              description={`A demonstration invoice preview was prepared for ${order.reference}.`}
            >
              Create invoice
            </DemoActionButton>
            <ConfirmDialog
              title="Release order to the warehouse?"
              description="This demonstration action shows the confirmation pattern used across the platform. No data is changed."
              confirmLabel="Release order"
              successMessage="Demo changes applied."
              trigger={<Button size="sm">Release to warehouse</Button>}
            />
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Order information" className="lg:col-span-2">
          <InfoGrid
            columns={3}
            items={[
              { label: "Order reference", value: order.reference },
              { label: "Order date", value: formatDate(order.orderDate) },
              { label: "Required date", value: formatDate(order.requiredDate) },
              { label: "Channel", value: order.channel },
              { label: "Sales representative", value: order.salesRep },
              { label: "Fulfilment warehouse", value: order.warehouseName },
              {
                label: "Customer",
                value: (
                  <Link
                    prefetch={false}
                    href={`/customers/${order.customerId}`}
                    className="text-primary hover:underline"
                  >
                    {order.customerName}
                  </Link>
                ),
              },
              { label: "Currency", value: order.currency },
              { label: "Line items", value: formatNumber(order.items.length) },
            ]}
          />
        </SectionCard>

        <SectionCard title="Order totals">
          <div className="space-y-1">
            <StatRow label="Subtotal" value={formatMoney(order.subtotal, order.currency)} />
            <StatRow label="Discount" value={formatMoney(order.discount, order.currency)} />
            <StatRow label="Tax (15% VAT)" value={formatMoney(order.tax, order.currency)} />
            <StatRow label="Shipping" value={formatMoney(order.shipping, order.currency)} />
            <StatRow label="Order total" value={formatMoney(order.total, order.currency)} />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Billing address">
          <address className="space-y-0.5 text-sm not-italic">
            <p className="font-medium">{order.customerName}</p>
            <p>{order.billingAddress.line1}</p>
            {order.billingAddress.line2 && <p>{order.billingAddress.line2}</p>}
            <p>
              {order.billingAddress.city}, {order.billingAddress.province} {order.billingAddress.postalCode}
            </p>
            <p>{order.billingAddress.country}</p>
          </address>
        </SectionCard>
        <SectionCard title="Shipping address">
          <address className="space-y-0.5 text-sm not-italic">
            <p className="font-medium">{order.customerName}</p>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </address>
        </SectionCard>
      </div>

      <SectionCard title="Order items" description="Quantities, pricing, discounts and tax per line.">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Line total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap font-medium">{item.sku}</TableCell>
                  <TableCell>
                    <Link
                      prefetch={false}
                      href={`/products/${item.productId}`}
                      className="text-primary hover:underline"
                    >
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(item.quantity)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(item.unitPrice, order.currency)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatPercent(item.discountPercent, 1)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPercent(item.taxPercent, 0)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatMoney(item.lineTotal, order.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Order timeline" description="Activity recorded against this order.">
          <ActivityTimeline events={order.timeline} />
        </SectionCard>
        <SectionCard title="Notes" description="Internal instructions captured with the order.">
          <p className="text-muted-foreground text-sm">{order.notes}</p>
        </SectionCard>
      </div>
    </div>
  );
}
