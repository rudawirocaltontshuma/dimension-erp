"use client";

import { AlertCircle, CheckCircle2, Plus, ReceiptText } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { customers } from "@/data/erp/customers";
import { invoices } from "@/data/erp/sales";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { Invoice } from "@/types/erp";

const specs: ColumnSpec<Invoice>[] = [
  {
    id: "reference",
    header: "Invoice",
    kind: "link",
    value: (row) => row.reference,
    href: (row) => `/invoices/${row.id}`,
  },
  { id: "customer", header: "Customer", kind: "strong", value: (row) => row.customerName },
  { id: "issued", header: "Issued", kind: "date", value: (row) => row.issueDate },
  { id: "due", header: "Due", kind: "date", value: (row) => row.dueDate },
  {
    id: "total",
    header: "Total",
    kind: "money",
    align: "right",
    value: (row) => row.total,
    currency: (row) => row.currency,
  },
  {
    id: "paid",
    header: "Paid",
    kind: "money",
    align: "right",
    value: (row) => row.amountPaid,
    currency: (row) => row.currency,
  },
  {
    id: "balance",
    header: "Balance",
    kind: "money",
    align: "right",
    value: (row) => row.balanceDue,
    currency: (row) => row.currency,
  },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function InvoicesPage() {
  const invoiced = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const collected = invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0);
  const overdue = invoices.filter((invoice) => invoice.status === "Overdue");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Customer invoices with settlement status, ageing and printable tax invoice documents."
        breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Invoices" }]}
        actions={
          <DemoFormDialog
            title="New invoice"
            description="Raise a demonstration tax invoice against a customer account."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New invoice
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
              { name: "order", label: "Linked sales order", placeholder: "ORD-10482" },
              { name: "issueDate", label: "Issue date", type: "date", required: true },
              { name: "dueDate", label: "Due date", type: "date", required: true },
              { name: "amount", label: "Invoice amount (ZAR)", type: "number", required: true },
              { name: "notes", label: "Invoice notes", type: "textarea" },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Invoices raised"
          value={formatNumber(invoices.length)}
          hint="Current financial year"
          icon={ReceiptText}
        />
        <KpiCard label="Invoiced value" value={formatMoney(invoiced)} hint="Including VAT" icon={ReceiptText} />
        <KpiCard label="Collected" value={formatMoney(collected)} hint="Receipts allocated" icon={CheckCircle2} />
        <KpiCard
          label="Overdue"
          value={formatMoney(overdue.reduce((sum, invoice) => sum + invoice.balanceDue, 0))}
          hint={`${overdue.length} invoices past due`}
          icon={AlertCircle}
        />
      </section>

      <SectionCard title="Invoice register" description="Select a row to open the printable invoice document.">
        <DataTable
          data={invoices}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.customerName} ${row.status}`}
          searchPlaceholder="Search invoices or customers"
          rowHref={(row) => `/invoices/${row.id}`}
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(invoices, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "currency",
              label: "Currency",
              options: uniqueValues(invoices, (row) => row.currency),
              getValue: (row) => row.currency,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
