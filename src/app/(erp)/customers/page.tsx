"use client";

import { Building2, Plus, TrendingUp, Users, Wallet } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { customers } from "@/data/erp/customers";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { Customer } from "@/types/erp";

const specs: ColumnSpec<Customer>[] = [
  { id: "id", header: "Account", kind: "link", value: (row) => row.id, href: (row) => `/customers/${row.id}` },
  { id: "name", header: "Customer", kind: "strong", value: (row) => row.tradingName },
  { id: "segment", header: "Segment", kind: "muted", value: (row) => row.segment },
  { id: "industry", header: "Industry", kind: "muted", value: (row) => row.industry },
  { id: "city", header: "Location", kind: "muted", value: (row) => row.billingAddress.city },
  { id: "manager", header: "Account manager", kind: "muted", value: (row) => row.accountManager },
  { id: "orders", header: "Orders", kind: "number", align: "right", value: (row) => row.totalOrders },
  {
    id: "revenue",
    header: "Revenue",
    kind: "money",
    align: "right",
    value: (row) => row.totalRevenue,
    currency: (row) => row.currency,
  },
  {
    id: "balance",
    header: "Outstanding",
    kind: "money",
    align: "right",
    value: (row) => row.outstandingBalance,
    currency: (row) => row.currency,
  },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function CustomersPage() {
  const active = customers.filter((customer) => customer.status === "Active").length;
  const revenue = customers.reduce((sum, customer) => sum + customer.totalRevenue, 0);
  const outstanding = customers.reduce((sum, customer) => sum + customer.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Trading accounts across the enterprise, wholesale, retail, government and reseller segments."
        breadcrumbs={[{ label: "Operations", href: "/dashboard" }, { label: "Customers" }]}
        actions={
          <DemoFormDialog
            title="New customer account"
            description="Capture a demonstration trading account with credit terms."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New customer
              </Button>
            }
            fields={[
              { name: "name", label: "Registered name", required: true, placeholder: "Example Trading (Pty) Ltd" },
              { name: "trading", label: "Trading name", required: true },
              {
                name: "segment",
                label: "Segment",
                type: "select",
                required: true,
                options: ["Enterprise", "Wholesale", "Retail", "Government", "Reseller"],
              },
              { name: "email", label: "Accounts email", type: "email", required: true },
              {
                name: "creditLimit",
                label: "Credit limit (ZAR)",
                type: "number",
                description: "Used for order credit checks.",
              },
              {
                name: "terms",
                label: "Payment terms",
                type: "select",
                options: ["Net 30", "Net 45", "Net 60", "30 days EOM", "Prepaid"],
              },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Customer accounts"
          value={formatNumber(customers.length)}
          hint={`${active} currently active`}
          icon={Users}
        />
        <KpiCard
          label="Lifetime revenue"
          value={formatMoney(revenue)}
          hint="All accounts, all periods"
          icon={TrendingUp}
        />
        <KpiCard
          label="Outstanding balance"
          value={formatMoney(outstanding)}
          hint="Across open invoices"
          icon={Wallet}
        />
        <KpiCard
          label="Segments covered"
          value={formatNumber(new Set(customers.map((customer) => customer.segment)).size)}
          hint="Enterprise through reseller"
          icon={Building2}
        />
      </section>

      <SectionCard title="Customer register" description="Select a row to open the full customer profile.">
        <DataTable
          data={customers}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.id} ${row.tradingName} ${row.name} ${row.industry} ${row.accountManager}`}
          searchPlaceholder="Search customers or account managers"
          rowHref={(row) => `/customers/${row.id}`}
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(customers, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "segment",
              label: "Segment",
              options: uniqueValues(customers, (row) => row.segment),
              getValue: (row) => row.segment,
            },
            {
              id: "industry",
              label: "Industry",
              options: uniqueValues(customers, (row) => row.industry),
              getValue: (row) => row.industry,
            },
            {
              id: "manager",
              label: "Manager",
              options: uniqueValues(customers, (row) => row.accountManager),
              getValue: (row) => row.accountManager,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
