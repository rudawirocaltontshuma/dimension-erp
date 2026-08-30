"use client";

import { ArrowDownLeft, ArrowUpRight, CreditCard, Wallet } from "lucide-react";

import { ChartCard, ErpPieChart } from "@/components/erp/charts";
import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { payments } from "@/data/erp/sales";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { Payment } from "@/types/erp";

const specs: ColumnSpec<Payment>[] = [
  { id: "reference", header: "Reference", kind: "strong", value: (row) => row.reference },
  { id: "date", header: "Date", kind: "date", value: (row) => row.date },
  { id: "party", header: "Party", value: (row) => row.party },
  { id: "partyType", header: "Type", kind: "muted", value: (row) => row.partyType },
  { id: "document", header: "Document", kind: "muted", value: (row) => row.documentRef },
  { id: "method", header: "Method", kind: "muted", value: (row) => row.method },
  { id: "account", header: "Bank account", kind: "muted", value: (row) => row.account },
  { id: "amount", header: "Amount", kind: "money", align: "right", value: (row) => row.amount },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function PaymentsPage() {
  const received = payments.filter((payment) => payment.partyType === "Customer");
  const paid = payments.filter((payment) => payment.partyType === "Supplier");
  const methodSplit = Array.from(
    payments.reduce((map, payment) => {
      map.set(payment.method, (map.get(payment.method) ?? 0) + payment.amount);
      return map;
    }, new Map<string, number>()),
  ).map(([name, value]) => ({ name, value: Math.round(value) }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Customer receipts and supplier payments across every banking channel."
        breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Payments" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Payments recorded"
          value={formatNumber(payments.length)}
          hint="Rolling 180 days"
          icon={CreditCard}
        />
        <KpiCard
          label="Receipts in"
          value={formatMoney(received.reduce((sum, payment) => sum + payment.amount, 0))}
          hint={`${received.length} customer receipts`}
          icon={ArrowDownLeft}
        />
        <KpiCard
          label="Payments out"
          value={formatMoney(paid.reduce((sum, payment) => sum + payment.amount, 0))}
          hint={`${paid.length} supplier payments`}
          icon={ArrowUpRight}
        />
        <KpiCard
          label="Pending settlement"
          value={formatNumber(payments.filter((payment) => payment.status === "Pending").length)}
          hint="Awaiting bank clearance"
          icon={Wallet}
        />
      </section>

      <ChartCard title="Payments by method" description="Value processed through each payment method.">
        <ErpPieChart data={methodSplit} />
      </ChartCard>

      <SectionCard title="Payment register">
        <DataTable
          data={payments}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.party} ${row.documentRef} ${row.method}`}
          searchPlaceholder="Search payments, parties or documents"
          pageSize={20}
          filters={[
            {
              id: "method",
              label: "Method",
              options: uniqueValues(payments, (row) => row.method),
              getValue: (row) => row.method,
            },
            {
              id: "status",
              label: "Status",
              options: uniqueValues(payments, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "partyType",
              label: "Party type",
              options: uniqueValues(payments, (row) => row.partyType),
              getValue: (row) => row.partyType,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
