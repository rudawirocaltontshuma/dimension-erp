"use client";

import { CheckCircle2, FileText, Plus, Send } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { customers } from "@/data/erp/customers";
import { quotes, salesReps } from "@/data/erp/sales";
import { formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";
import type { Quote } from "@/types/erp";

const specs: ColumnSpec<Quote>[] = [
  { id: "reference", header: "Quote", kind: "link", value: (row) => row.reference, href: (row) => `/quotes/${row.id}` },
  { id: "customer", header: "Customer", kind: "strong", value: (row) => row.customerName },
  { id: "created", header: "Created", kind: "date", value: (row) => row.createdDate },
  { id: "expiry", header: "Expires", kind: "date", value: (row) => row.expiryDate },
  { id: "rep", header: "Sales rep", kind: "muted", value: (row) => row.salesRep },
  { id: "probability", header: "Probability", kind: "percent", align: "right", value: (row) => row.probability },
  {
    id: "total",
    header: "Amount",
    kind: "money",
    align: "right",
    value: (row) => row.total,
    currency: (row) => row.currency,
  },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function QuotesPage() {
  const accepted = quotes.filter((quote) => quote.status === "Accepted");
  const open = quotes.filter((quote) => quote.status === "Sent" || quote.status === "Viewed");
  const pipeline = open.reduce((sum, quote) => sum + quote.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotes"
        description="Quotations issued to customers with expiry dates, win probability and conversion status."
        breadcrumbs={[{ label: "Sales", href: "/sales" }, { label: "Quotes" }]}
        actions={
          <DemoFormDialog
            title="New quotation"
            description="Prepare a demonstration quotation for a customer account."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New quote
              </Button>
            }
            fields={[
              {
                name: "customer",
                label: "Customer",
                type: "select",
                required: true,
                options: customers.slice(0, 20).map((customer) => customer.tradingName),
              },
              { name: "rep", label: "Sales representative", type: "select", required: true, options: salesReps },
              { name: "expiry", label: "Expiry date", type: "date", required: true },
              { name: "value", label: "Estimated value (ZAR)", type: "number" },
              { name: "notes", label: "Commercial notes", type: "textarea" },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Quotes issued" value={formatNumber(quotes.length)} hint="All statuses" icon={FileText} />
        <KpiCard
          label="Open pipeline"
          value={formatMoney(pipeline)}
          hint={`${open.length} awaiting decision`}
          icon={Send}
        />
        <KpiCard
          label="Accepted"
          value={formatNumber(accepted.length)}
          hint={formatMoney(accepted.reduce((sum, quote) => sum + quote.total, 0))}
          icon={CheckCircle2}
        />
        <KpiCard
          label="Win rate"
          value={formatPercent((accepted.length / quotes.length) * 100)}
          hint="Accepted versus issued"
          icon={CheckCircle2}
        />
      </section>

      <SectionCard title="Quote register">
        <DataTable
          data={quotes}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.customerName} ${row.salesRep}`}
          searchPlaceholder="Search quotes or customers"
          rowHref={(row) => `/quotes/${row.id}`}
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(quotes, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "rep",
              label: "Sales rep",
              options: uniqueValues(quotes, (row) => row.salesRep),
              getValue: (row) => row.salesRep,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
