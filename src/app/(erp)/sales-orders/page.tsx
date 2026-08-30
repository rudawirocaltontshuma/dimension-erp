"use client";

import { ClipboardList, PackageCheck, Truck, Wallet } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { orders } from "@/data/erp/sales";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { Order } from "@/types/erp";

const specs: ColumnSpec<Order>[] = [
  {
    id: "reference",
    header: "Sales order",
    kind: "link",
    value: (row) => row.reference,
    href: (row) => `/orders/${row.id}`,
  },
  { id: "customer", header: "Customer", kind: "strong", value: (row) => row.customerName },
  { id: "orderDate", header: "Captured", kind: "date", value: (row) => row.orderDate },
  { id: "requiredDate", header: "Required", kind: "date", value: (row) => row.requiredDate },
  { id: "rep", header: "Sales rep", kind: "muted", value: (row) => row.salesRep },
  { id: "fulfilment", header: "Fulfilment", kind: "status", value: (row) => row.fulfillmentStatus },
  { id: "payment", header: "Payment", kind: "status", value: (row) => row.paymentStatus },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
  {
    id: "total",
    header: "Value",
    kind: "money",
    align: "right",
    value: (row) => row.total,
    currency: (row) => row.currency,
  },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function SalesOrdersPage() {
  const open = orders.filter((order) => order.status === "Pending" || order.status === "Processing");
  const awaitingDispatch = orders.filter(
    (order) => order.fulfillmentStatus === "Packed" || order.fulfillmentStatus === "Picking",
  );
  const unpaid = orders.filter((order) => order.paymentStatus === "Unpaid");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Orders"
        description="Confirmed customer orders progressing through picking, packing, dispatch and settlement."
        breadcrumbs={[{ label: "Sales", href: "/sales" }, { label: "Sales Orders" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Open orders"
          value={formatNumber(open.length)}
          hint="Pending and processing"
          icon={ClipboardList}
        />
        <KpiCard
          label="Open order value"
          value={formatMoney(open.reduce((sum, order) => sum + order.total, 0))}
          hint="Committed revenue"
          icon={Wallet}
        />
        <KpiCard
          label="Awaiting dispatch"
          value={formatNumber(awaitingDispatch.length)}
          hint="Picked or packed"
          icon={PackageCheck}
        />
        <KpiCard label="Unpaid orders" value={formatNumber(unpaid.length)} hint="No settlement recorded" icon={Truck} />
      </section>

      <SectionCard title="Sales order register" description="Select a row to open the linked order detail screen.">
        <DataTable
          data={orders}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.customerName} ${row.salesRep}`}
          searchPlaceholder="Search sales orders"
          rowHref={(row) => `/orders/${row.id}`}
          pageSize={20}
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(orders, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "fulfilment",
              label: "Fulfilment",
              options: uniqueValues(orders, (row) => row.fulfillmentStatus),
              getValue: (row) => row.fulfillmentStatus,
            },
            {
              id: "rep",
              label: "Sales rep",
              options: uniqueValues(orders, (row) => row.salesRep),
              getValue: (row) => row.salesRep,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
