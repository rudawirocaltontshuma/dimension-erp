import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import { ConfirmDialog, PrintButton } from "@/components/erp/demo-actions";
import { InfoGrid, SectionCard, StatRow } from "@/components/erp/detail-panels";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { goodsReceipts, purchaseOrders } from "@/data/erp/procurement";
import { formatDate, formatMoney, formatNumber } from "@/lib/erp/format";

export function generateStaticParams() {
  return purchaseOrders.map((order) => ({ id: order.id }));
}

export default async function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = purchaseOrders.find((entry) => entry.id === id);
  if (!order) notFound();

  const receipts = goodsReceipts.filter((receipt) => receipt.purchaseOrderRef === order.reference);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Purchase order ${order.reference}`}
        description={`${order.supplierName} · raised ${formatDate(order.orderDate)} by ${order.buyer}`}
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "Purchase Orders", href: "/purchase-orders" },
          { label: order.reference },
        ]}
        meta={
          <div className="pt-1">
            <StatusBadge status={order.status} />
          </div>
        }
        actions={
          <>
            <PrintButton label="Print order" />
            <ConfirmDialog
              title="Approve this purchase order?"
              description="This demonstration approval shows the governance pattern used in the platform. No data is changed."
              confirmLabel="Approve order"
              trigger={<Button size="sm">Approve</Button>}
            />
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Order information" className="lg:col-span-2">
          <InfoGrid
            columns={3}
            items={[
              { label: "PO number", value: order.reference },
              {
                label: "Supplier",
                value: (
                  <Link
                    prefetch={false}
                    href={`/suppliers/${order.supplierId}`}
                    className="text-primary hover:underline"
                  >
                    {order.supplierName}
                  </Link>
                ),
              },
              { label: "Buyer", value: order.buyer },
              { label: "Order date", value: formatDate(order.orderDate) },
              { label: "Expected delivery", value: formatDate(order.expectedDate) },
              { label: "Deliver to", value: order.warehouseName },
              { label: "Category", value: order.category },
              { label: "Currency", value: order.currency },
              { label: "Line items", value: formatNumber(order.items.length) },
            ]}
          />
        </SectionCard>
        <SectionCard title="Order totals">
          <div className="space-y-1">
            <StatRow label="Subtotal" value={formatMoney(order.subtotal, order.currency)} />
            <StatRow label="VAT at 15%" value={formatMoney(order.tax, order.currency)} />
            <StatRow label="Order total" value={formatMoney(order.total, order.currency)} />
            <StatRow label="Goods receipts" value={formatNumber(receipts.length)} />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Ordered items">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty ordered</TableHead>
                <TableHead className="text-right">Unit cost</TableHead>
                <TableHead className="text-right">Line total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
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
        <SectionCard title="Goods receipts" description="Deliveries booked against this order.">
          {receipts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No goods receipts have been booked against this order yet.</p>
          ) : (
            <ul className="divide-y">
              {receipts.map((receipt) => (
                <li key={receipt.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="font-medium text-sm">{receipt.reference}</p>
                    <p className="text-muted-foreground text-xs">
                      {receipt.warehouseName} · {formatDate(receipt.receivedDate)}
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
          )}
        </SectionCard>
        <SectionCard title="Order timeline">
          <ActivityTimeline events={order.timeline} />
        </SectionCard>
      </div>
    </div>
  );
}
