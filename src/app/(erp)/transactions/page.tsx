"use client";

import { ArrowDownLeft, ArrowUpRight, Coins, ScrollText } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { transactions } from "@/data/erp/finance";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { Transaction } from "@/types/erp";

const specs: ColumnSpec<Transaction>[] = [
  { id: "reference", header: "Reference", kind: "strong", value: (row) => row.reference },
  { id: "date", header: "Date", kind: "date", value: (row) => row.date },
  { id: "description", header: "Description", value: (row) => row.description },
  { id: "category", header: "Category", kind: "muted", value: (row) => row.category },
  { id: "account", header: "Account", kind: "muted", value: (row) => `${row.accountCode} — ${row.accountName}` },
  { id: "source", header: "Source", kind: "muted", value: (row) => row.source },
  { id: "debit", header: "Debit", kind: "money", align: "right", value: (row) => row.debit },
  { id: "credit", header: "Credit", kind: "money", align: "right", value: (row) => row.credit },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function TransactionsPage() {
  const debits = transactions.reduce((sum, transaction) => sum + transaction.debit, 0);
  const credits = transactions.reduce((sum, transaction) => sum + transaction.credit, 0);
  const reconciled = transactions.filter((transaction) => transaction.status === "Reconciled").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="General ledger postings originating from sales, procurement, payroll, inventory and the bank feed."
        breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Transactions" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Transactions" value={formatNumber(transactions.length)} hint="Current financial year" icon={ScrollText} />
        <KpiCard label="Total debits" value={formatMoney(debits)} hint="All ledger accounts" icon={ArrowUpRight} />
        <KpiCard label="Total credits" value={formatMoney(credits)} hint="All ledger accounts" icon={ArrowDownLeft} />
        <KpiCard label="Reconciled" value={formatNumber(reconciled)} hint="Matched to the bank statement" icon={Coins} />
      </section>

      <SectionCard title="Transaction register">
        <DataTable
          data={transactions}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.description} ${row.category} ${row.accountName} ${row.source}`}
          searchPlaceholder="Search transactions, accounts or categories"
          pageSize={20}
          filters={[
            { id: "status", label: "Status", options: uniqueValues(transactions, (row) => row.status), getValue: (row) => row.status },
            { id: "category", label: "Category", options: uniqueValues(transactions, (row) => row.category), getValue: (row) => row.category },
            { id: "source", label: "Source", options: uniqueValues(transactions, (row) => row.source), getValue: (row) => row.source },
          ]}
        />
      </SectionCard>
    </div>
  );
}
