"use client";

import { AlertCircle, CheckCircle2, FileSpreadsheet, Wallet } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { supplierInvoices } from "@/data/erp/procurement";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { SupplierInvoice } from "@/types/erp";

const specs: ColumnSpec<SupplierInvoice>[] = [
  { id: "reference", header: "Invoice", kind: "strong", value: (row) => row.reference },
  { id: "supplier", header: "Supplier", value: (row) => row.supplierName },
  {
    id: "po",
    header: "Purchase order",
    kind: "link",
    value: (row) => row.purchaseOrderRef,
    href: (row) => `/purchase-orders/${row.purchaseOrderRef}`,
  },
  { id: "invoiceDate", header: "Invoice date", kind: "date", value: (row) => row.invoiceDate },
  { id: "dueDate", header: "Due", kind: "date", value: (row) => row.dueDate },
  {
    id: "amount",
    header: "Amount",
    kind: "money",
    align: "right",
    value: (row) => row.amount,
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
    value: (row) => row.amount - row.amountPaid,
    currency: (row) => row.currency,
  },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function SupplierInvoicesPage() {
  const outstanding = supplierInvoices.filter((invoice) => invoice.status !== "Paid");
  const overdue = supplierInvoices.filter((invoice) => invoice.status === "Overdue");
  const awaiting = supplierInvoices.filter((invoice) => invoice.status === "Awaiting Approval");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Invoices"
        description="Accounts payable documents matched to purchase orders and goods receipts."
        breadcrumbs={[{ label: "Procurement", href: "/procurement" }, { label: "Supplier Invoices" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Supplier invoices"
          value={formatNumber(supplierInvoices.length)}
          hint="Current period"
          icon={FileSpreadsheet}
        />
        <KpiCard
          label="Outstanding"
          value={formatMoney(outstanding.reduce((sum, invoice) => sum + (invoice.amount - invoice.amountPaid), 0))}
          hint={`${outstanding.length} unpaid documents`}
          icon={Wallet}
        />
        <KpiCard
          label="Awaiting approval"
          value={formatNumber(awaiting.length)}
          hint="Blocked for payment"
          icon={CheckCircle2}
        />
        <KpiCard label="Overdue" value={formatNumber(overdue.length)} hint="Past supplier terms" icon={AlertCircle} />
      </section>

      <SectionCard title="Payables register">
        <DataTable
          data={supplierInvoices}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.supplierName} ${row.purchaseOrderRef}`}
          searchPlaceholder="Search supplier invoices"
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(supplierInvoices, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "currency",
              label: "Currency",
              options: uniqueValues(supplierInvoices, (row) => row.currency),
              getValue: (row) => row.currency,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
