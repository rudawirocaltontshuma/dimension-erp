import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import { DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { SectionCard, StatRow } from "@/components/erp/detail-panels";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NEXORA } from "@/data/erp/organisation";
import { invoices } from "@/data/erp/sales";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export function generateStaticParams() {
  return invoices.map((invoice) => ({ id: invoice.id }));
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = invoices.find((entry) => entry.id === id);
  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Invoice ${invoice.reference}`}
        description={`${invoice.customerName} · issued ${formatDate(invoice.issueDate)} · due ${formatDate(invoice.dueDate)}`}
        breadcrumbs={[
          { label: "Finance", href: "/finance" },
          { label: "Invoices", href: "/invoices" },
          { label: invoice.reference },
        ]}
        meta={
          <div className="pt-1">
            <StatusBadge status={invoice.status} />
          </div>
        }
        actions={
          <>
            <PrintButton label="Print invoice" />
            <DemoActionButton
              variant="outline"
              size="sm"
              message="Invoice preview opened."
              description={`A demonstration PDF preview was prepared for ${invoice.reference}.`}
            >
              Preview document
            </DemoActionButton>
            <DemoActionButton
              size="sm"
              message="Demo changes applied."
              description="A payment allocation was simulated."
            >
              Record payment
            </DemoActionButton>
          </>
        }
      />

      <Card className="print:border-0 print:shadow-none">
        <CardContent className="space-y-6 p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p className="font-semibold text-lg">{NEXORA.legalName}</p>
              <p className="text-muted-foreground text-sm">{NEXORA.headOffice.line1}</p>
              <p className="text-muted-foreground text-sm">{NEXORA.headOffice.line2}</p>
              <p className="text-muted-foreground text-sm">
                {NEXORA.headOffice.city}, {NEXORA.headOffice.province} {NEXORA.headOffice.postalCode}
              </p>
              <p className="text-muted-foreground text-sm">
                VAT {NEXORA.vatNumber} · Reg {NEXORA.registration}
              </p>
            </div>
            <div className="space-y-1 sm:text-right">
              <p className="font-semibold text-xl">Tax Invoice</p>
              <p className="text-sm">{invoice.reference}</p>
              <p className="text-muted-foreground text-sm">Issued {formatDate(invoice.issueDate)}</p>
              <p className="text-muted-foreground text-sm">Due {formatDate(invoice.dueDate)}</p>
              {invoice.orderId && (
                <p className="text-muted-foreground text-sm">
                  Order{" "}
                  <Link prefetch={false} href={`/orders/${invoice.orderId}`} className="text-primary hover:underline">
                    {invoice.orderId}
                  </Link>
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Billed to</p>
              <p className="font-medium text-sm">{invoice.customerName}</p>
              <p className="text-sm">{invoice.billingAddress.line1}</p>
              {invoice.billingAddress.line2 && <p className="text-sm">{invoice.billingAddress.line2}</p>}
              <p className="text-sm">
                {invoice.billingAddress.city}, {invoice.billingAddress.province} {invoice.billingAddress.postalCode}
              </p>
              <p className="text-sm">{invoice.billingAddress.country}</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Payment status</p>
              <p className="font-medium text-sm">{invoice.status}</p>
              <p className="text-sm">Paid {formatMoney(invoice.amountPaid, invoice.currency)}</p>
              <p className="text-sm">Balance {formatMoney(invoice.balanceDue, invoice.currency)}</p>
              <p className="text-muted-foreground text-sm">Currency {invoice.currency}</p>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit price</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">VAT</TableHead>
                  <TableHead className="text-right">Line total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(item.quantity)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(item.unitPrice, invoice.currency)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatPercent(item.discountPercent)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatPercent(item.taxPercent, 0)}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatMoney(item.lineTotal, invoice.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-1">
              <StatRow label="Subtotal" value={formatMoney(invoice.subtotal, invoice.currency)} />
              <StatRow label="Discount" value={formatMoney(invoice.discount, invoice.currency)} />
              <StatRow label="VAT at 15%" value={formatMoney(invoice.tax, invoice.currency)} />
              <StatRow label="Invoice total" value={formatMoney(invoice.total, invoice.currency)} />
              <StatRow label="Amount paid" value={formatMoney(invoice.amountPaid, invoice.currency)} />
              <StatRow label="Balance due" value={formatMoney(invoice.balanceDue, invoice.currency)} />
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="font-medium text-sm">Notes</p>
            <p className="text-muted-foreground text-sm">{invoice.notes}</p>
            <p className="text-muted-foreground text-xs">
              Banking details are intentionally omitted — this document is a portfolio demonstration and no payment can
              be made against it.
            </p>
          </div>
        </CardContent>
      </Card>

      <SectionCard title="Invoice activity" className="print:hidden">
        <ActivityTimeline events={invoice.timeline} />
      </SectionCard>
    </div>
  );
}
