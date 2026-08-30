"use client";

import { CheckCircle2, Clock, Plus, ShoppingCart, XCircle } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { customers } from "@/data/erp/customers";
import { orders } from "@/data/erp/sales";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { Order } from "@/types/erp";

const specs: ColumnSpec<Order>[] = [
  { id: "reference", header: "Order", kind: "link", value: (row) => row.reference, href: (row) => `/orders/${row.id}` },
  { id: "customer", header: "Customer", kind: "strong", value: (row) => row.customerName },
  { id: "orderDate", header: "Order date", kind: "date", value: (row) => row.orderDate },
  { id: "requiredDate", header: "Required", kind: "date", value: (row) => row.requiredDate },
  { id: "channel", header: "Channel", kind: "muted", value: (row) => row.channel },
  { id: "salesRep", header: "Sales rep", kind: "muted", value: (row) => row.salesRep },
  { id: "warehouse", header: "Warehouse", kind: "muted", value: (row) => row.warehouseName },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
  { id: "payment", header: "Payment", kind: "status", value: (row) => row.paymentStatus },
  { id: "fulfilment", header: "Fulfilment", kind: "status", value: (row) => row.fulfillmentStatus },
  {
    id: "total",
    header: "Total",
    kind: "money",
    align: "right",
    value: (row) => row.total,
    currency: (row) => row.currency,
  },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function OrdersPage() {
  const completed = orders.filter((order) => order.status === "Completed").length;
  const processing = orders.filter((order) => order.status === "Processing").length;
  const pending = orders.filter((order) => order.status === "Pending").length;
  const cancelled = orders.filter((order) => order.status === "Cancelled").length;
  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Every sales order captured across direct, field, online, distributor and tender channels."
        breadcrumbs={[{ label: "Operations", href: "/dashboard" }, { label: "Orders" }]}
        actions={
          <DemoFormDialog
            title="New sales order"
            description="Capture a demonstration sales order. Nothing is persisted in this frontend demo."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New order
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
              {
                name: "channel",
                label: "Channel",
                type: "select",
                required: true,
                options: ["Direct Sales", "Field Sales", "Online Portal", "Distributor", "Tender"],
              },
              { name: "requiredDate", label: "Required date", type: "date", required: true },
              {
                name: "warehouse",
                label: "Fulfilment warehouse",
                type: "select",
                options: [
                  "Johannesburg Distribution Centre",
                  "Cape Town Distribution Centre",
                  "Durban Distribution Centre",
                  "Pretoria Warehouse",
                ],
              },
              { name: "reference", label: "Customer reference", placeholder: "Purchase order number" },
              {
                name: "notes",
                label: "Delivery notes",
                type: "textarea",
                description: "Optional instructions shown on the picking slip.",
              },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total orders" value={formatNumber(orders.length)} hint="All channels" icon={ShoppingCart} />
        <KpiCard
          label="Order value"
          value={formatMoney(totalValue)}
          hint="Gross value including tax"
          icon={CheckCircle2}
        />
        <KpiCard
          label="In progress"
          value={formatNumber(processing + pending)}
          hint={`${processing} processing · ${pending} pending`}
          icon={Clock}
        />
        <KpiCard
          label="Cancelled"
          value={formatNumber(cancelled)}
          hint={`${completed} completed to date`}
          icon={XCircle}
        />
      </section>

      <SectionCard
        title="Order register"
        description="Search, filter and sort the full order book. Select a row to open the order detail screen."
      >
        <DataTable
          data={orders}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.customerName} ${row.salesRep} ${row.status}`}
          searchPlaceholder="Search orders, customers or reps"
          rowHref={(row) => `/orders/${row.id}`}
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(orders, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "payment",
              label: "Payment",
              options: uniqueValues(orders, (row) => row.paymentStatus),
              getValue: (row) => row.paymentStatus,
            },
            {
              id: "channel",
              label: "Channel",
              options: uniqueValues(orders, (row) => row.channel),
              getValue: (row) => row.channel,
            },
            {
              id: "warehouse",
              label: "Warehouse",
              options: uniqueValues(orders, (row) => row.warehouseName),
              getValue: (row) => row.warehouseName,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
