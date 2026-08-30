"use client";

import { Building2, Gauge, Plus, Wallet } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { suppliers } from "@/data/erp/suppliers";
import { formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";
import type { Supplier } from "@/types/erp";

const specs: ColumnSpec<Supplier>[] = [
  { id: "id", header: "Supplier ID", kind: "link", value: (row) => row.id, href: (row) => `/suppliers/${row.id}` },
  { id: "name", header: "Supplier", kind: "strong", value: (row) => row.name },
  { id: "category", header: "Category", kind: "muted", value: (row) => row.category },
  { id: "contact", header: "Contact", kind: "muted", value: (row) => row.contactName },
  { id: "location", header: "Location", kind: "muted", value: (row) => `${row.city}, ${row.country}` },
  { id: "leadTime", header: "Lead time", kind: "number", align: "right", value: (row) => row.leadTimeDays },
  { id: "orders", header: "Orders", kind: "number", align: "right", value: (row) => row.totalOrders },
  {
    id: "spend",
    header: "Spend",
    kind: "money",
    align: "right",
    value: (row) => row.totalSpend,
    currency: (row) => row.currency,
  },
  { id: "otd", header: "On-time %", kind: "percent", align: "right", value: (row) => row.onTimeDeliveryRate },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function SuppliersPage() {
  const spend = suppliers.reduce((sum, supplier) => sum + supplier.totalSpend, 0);
  const averageOtd = suppliers.reduce((sum, supplier) => sum + supplier.onTimeDeliveryRate, 0) / suppliers.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="The vendor master with commercial terms, delivery performance and quality scoring."
        breadcrumbs={[{ label: "Procurement", href: "/procurement" }, { label: "Suppliers" }]}
        actions={
          <DemoFormDialog
            title="New supplier"
            description="Register a demonstration supplier on the vendor master."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New supplier
              </Button>
            }
            fields={[
              { name: "name", label: "Supplier name", required: true },
              {
                name: "category",
                label: "Category",
                type: "select",
                required: true,
                options: uniqueValues(suppliers, (row) => row.category),
              },
              { name: "contact", label: "Primary contact", required: true },
              { name: "email", label: "Contact email", type: "email", required: true },
              {
                name: "terms",
                label: "Payment terms",
                type: "select",
                options: ["Net 30", "Net 45", "Net 60", "30 days EOM", "Cash on Delivery"],
              },
              { name: "leadTime", label: "Lead time (days)", type: "number" },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Suppliers"
          value={formatNumber(suppliers.length)}
          hint={`${suppliers.filter((supplier) => supplier.status === "Active").length} active`}
          icon={Building2}
        />
        <KpiCard label="Lifetime spend" value={formatMoney(spend)} hint="Across all suppliers" icon={Wallet} />
        <KpiCard
          label="Average on-time delivery"
          value={formatPercent(averageOtd)}
          hint="Weighted by supplier"
          icon={Gauge}
        />
        <KpiCard
          label="Under review"
          value={formatNumber(suppliers.filter((supplier) => supplier.status === "Under Review").length)}
          hint="Requires governance action"
          icon={Building2}
        />
      </section>

      <SectionCard title="Vendor master">
        <DataTable
          data={suppliers}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.id} ${row.name} ${row.category} ${row.contactName} ${row.city}`}
          searchPlaceholder="Search suppliers or categories"
          rowHref={(row) => `/suppliers/${row.id}`}
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(suppliers, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "category",
              label: "Category",
              options: uniqueValues(suppliers, (row) => row.category),
              getValue: (row) => row.category,
            },
            {
              id: "country",
              label: "Country",
              options: uniqueValues(suppliers, (row) => row.country),
              getValue: (row) => row.country,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
