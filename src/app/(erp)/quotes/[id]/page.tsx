import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import { DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { InfoGrid, SectionCard, StatRow } from "@/components/erp/detail-panels";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { quotes } from "@/data/erp/sales";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export function generateStaticParams() {
  return quotes.map((quote) => ({ id: quote.id }));
}

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = quotes.find((entry) => entry.id === id);
  if (!quote) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Quote ${quote.reference}`}
        description={`${quote.customerName} · prepared by ${quote.salesRep}`}
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Quotes", href: "/quotes" },
          { label: quote.reference },
        ]}
        meta={
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={quote.status} />
            <span className="text-muted-foreground text-xs">Valid until {formatDate(quote.expiryDate)}</span>
          </div>
        }
        actions={
          <>
            <PrintButton label="Print quote" />
            <DemoActionButton
              size="sm"
              message="Demo changes applied."
              description="The quotation was converted to a demonstration sales order."
            >
              Convert to order
            </DemoActionButton>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Quotation details" className="lg:col-span-2">
          <InfoGrid
            columns={3}
            items={[
              { label: "Quote number", value: quote.reference },
              {
                label: "Customer",
                value: (
                  <Link
                    prefetch={false}
                    href={`/customers/${quote.customerId}`}
                    className="text-primary hover:underline"
                  >
                    {quote.customerName}
                  </Link>
                ),
              },
              { label: "Sales representative", value: quote.salesRep },
              { label: "Created", value: formatDate(quote.createdDate) },
              { label: "Expiry", value: formatDate(quote.expiryDate) },
              { label: "Win probability", value: formatPercent(quote.probability, 0) },
            ]}
          />
        </SectionCard>
        <SectionCard title="Quote totals">
          <div className="space-y-1">
            <StatRow label="Subtotal" value={formatMoney(quote.subtotal, quote.currency)} />
            <StatRow label="Tax (15% VAT)" value={formatMoney(quote.tax, quote.currency)} />
            <StatRow label="Quote total" value={formatMoney(quote.total, quote.currency)} />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Quoted items">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Line total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quote.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(item.quantity)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(item.unitPrice, quote.currency)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatPercent(item.discountPercent)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatMoney(item.lineTotal, quote.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Terms and notes">
          <p className="text-muted-foreground text-sm">{quote.notes}</p>
        </SectionCard>
        <SectionCard title="Quote activity">
          <ActivityTimeline
            events={[
              {
                id: `${quote.id}-q1`,
                title: "Quotation prepared",
                description: `Prepared by ${quote.salesRep} on ${formatDate(quote.createdDate)}.`,
                timestamp: "2026-06-10T08:15:00.000Z",
                actor: quote.salesRep,
                tone: "info",
              },
              {
                id: `${quote.id}-q2`,
                title: "Sent to customer",
                description: "Delivered to the customer procurement contact for review.",
                timestamp: "2026-06-11T09:40:00.000Z",
                actor: "Sales Administration",
                tone: "info",
              },
              {
                id: `${quote.id}-q3`,
                title: `Status: ${quote.status}`,
                description: `The quotation is currently recorded as ${quote.status.toLowerCase()} in the demonstration dataset.`,
                timestamp: "2026-06-20T13:05:00.000Z",
                actor: quote.salesRep,
                tone: quote.status === "Accepted" ? "success" : quote.status === "Rejected" ? "danger" : "warning",
              },
            ]}
          />
        </SectionCard>
      </div>
    </div>
  );
}
