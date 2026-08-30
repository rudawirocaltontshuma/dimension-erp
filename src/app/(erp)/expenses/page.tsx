"use client";

import { useState } from "react";

import { CheckCircle2, Plus, Receipt, Wallet } from "lucide-react";

import { ChartCard, ErpBarChart } from "@/components/erp/charts";
import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { InfoGrid, SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { expenseCategories, expenses } from "@/data/erp/finance";
import { formatDate, formatMoney, formatNumber } from "@/lib/erp/format";
import type { Expense } from "@/types/erp";

const specs: ColumnSpec<Expense>[] = [
  { id: "reference", header: "Expense", kind: "strong", value: (row) => row.reference },
  { id: "date", header: "Date", kind: "date", value: (row) => row.date },
  { id: "category", header: "Category", kind: "muted", value: (row) => row.category },
  { id: "department", header: "Department", kind: "muted", value: (row) => row.department },
  { id: "employee", header: "Employee", value: (row) => row.employee },
  { id: "method", header: "Method", kind: "muted", value: (row) => row.paymentMethod },
  { id: "amount", header: "Amount", kind: "money", align: "right", value: (row) => row.amount },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function ExpensesPage() {
  const [selected, setSelected] = useState<Expense | null>(null);
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approved = expenses.filter((expense) => expense.status === "Approved" || expense.status === "Reimbursed");
  const submitted = expenses.filter((expense) => expense.status === "Submitted");

  const byCategory = expenseCategories.map((category) => ({
    category,
    amount: expenses.filter((expense) => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description="Employee expense claims by category, department and reimbursement status."
        breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Expenses" }]}
        actions={
          <DemoFormDialog
            title="New expense claim"
            description="Capture a demonstration expense claim for approval."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New expense
              </Button>
            }
            fields={[
              { name: "employee", label: "Employee", required: true },
              { name: "category", label: "Category", type: "select", required: true, options: expenseCategories },
              { name: "date", label: "Expense date", type: "date", required: true },
              { name: "amount", label: "Amount (ZAR)", type: "number", required: true },
              { name: "method", label: "Payment method", type: "select", options: ["Company Card", "Reimbursement", "Petty Cash", "Direct Payment"] },
              { name: "description", label: "Description", type: "textarea", required: true },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Claims" value={formatNumber(expenses.length)} hint="Rolling 180 days" icon={Receipt} />
        <KpiCard label="Claimed value" value={formatMoney(total)} hint="Excluding VAT recovery" icon={Wallet} />
        <KpiCard label="Approved" value={formatMoney(approved.reduce((sum, expense) => sum + expense.amount, 0))} hint={`${approved.length} claims`} icon={CheckCircle2} />
        <KpiCard label="Awaiting review" value={formatNumber(submitted.length)} hint="Submitted claims" icon={Receipt} />
      </section>

      <ChartCard title="Expenses by category" description="Claimed value per expense category.">
        <ErpBarChart data={byCategory} xKey="category" money series={[{ key: "amount", label: "Claimed" }]} height={260} />
      </ChartCard>

      <SectionCard title="Expense register" description="Select a row to open the claim detail drawer.">
        <DataTable
          data={expenses}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.employee} ${row.category} ${row.department}`}
          searchPlaceholder="Search claims, employees or categories"
          pageSize={20}
          toolbarActions={
            <Button variant="outline" size="sm" onClick={() => setSelected(expenses[0])}>
              Preview claim
            </Button>
          }
          filters={[
            { id: "status", label: "Status", options: uniqueValues(expenses, (row) => row.status), getValue: (row) => row.status },
            { id: "category", label: "Category", options: expenseCategories, getValue: (row) => row.category },
            { id: "department", label: "Department", options: uniqueValues(expenses, (row) => row.department), getValue: (row) => row.department },
          ]}
        />
      </SectionCard>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selected?.reference}</SheetTitle>
            <SheetDescription>Expense claim detail preview.</SheetDescription>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 px-4 pb-8">
              <StatusBadge status={selected.status} />
              <InfoGrid
                items={[
                  { label: "Employee", value: selected.employee },
                  { label: "Department", value: selected.department },
                  { label: "Category", value: selected.category },
                  { label: "Date", value: formatDate(selected.date) },
                  { label: "Amount", value: formatMoney(selected.amount) },
                  { label: "VAT", value: formatMoney(selected.tax) },
                  { label: "Payment method", value: selected.paymentMethod },
                  { label: "Currency", value: selected.currency },
                ]}
              />
              <p className="text-muted-foreground text-sm">{selected.description}</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
