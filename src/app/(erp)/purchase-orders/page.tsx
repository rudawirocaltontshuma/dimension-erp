"use client";

import { FileStack, PackageCheck, Plus, Wallet } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { warehouses } from "@/data/erp/organisation";
import { buyers, purchaseOrders } from "@/data/erp/procurement";
import { suppliers } from "@/data/erp/suppliers";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { PurchaseOrder } from "@/types/erp";

const specs: ColumnSpec<PurchaseOrder>[] = [
  {
    id: "reference",
    header: "PO number",
    kind: "link",
    value: (row) => row.reference,
    href: (row) => `/purchase-orders/${row.id}`,
  },
  { id: "supplier", header: "Supplier", kind: "strong", value: (row) => row.supplierName },
  { id: "orderDate", header: "Order date", kind: "date", value: (row) => row.orderDate },
  { id: "expectedDate", header: "Expected", kind: "date", value: (row) => row.expectedDate },
  { id: "warehouse", header: "Deliver to", kind: "muted", value: (row) => row.warehouseName },
  { id: "buyer", header: "Buyer", kind: "muted", value: (row) => row.buyer },
  { id: "category", header: "Category", kind: "muted", value: (row) => row.category },
  {
    id: "total",
    header: "Value",
    kind: "money",
    align: "right",
    value: (row) => row.total,
    currency: (row) => row.currency,
  },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function PurchaseOrdersPage() {
  const committed = purchaseOrders.reduce((sum, order) => sum + order.total, 0);
  const received = purchaseOrders.filter((order) => order.status === "Received");
  const awaiting = purchaseOrders.filter((order) => order.status === "Sent" || order.status === "Approved");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Committed supplier orders with delivery expectations, buyers and receipting status."
        breadcrumbs={[{ label: "Procurement", href: "/procurement" }, { label: "Purchase Orders" }]}
        actions={
          <DemoFormDialog
            title="New purchase order"
            description="Raise a demonstration purchase order against a supplier."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New purchase order
              </Button>
            }
            fields={[
              {
                name: "supplier",
                label: "Supplier",
                type: "select",
                required: true,
                options: suppliers.slice(0, 20).map((supplier) => supplier.name),
              },
              {
                name: "warehouse",
                label: "Deliver to",
                type: "select",
                required: true,
                options: warehouses.map((warehouse) => warehouse.name),
              },
              { name: "buyer", label: "Buyer", type: "select", options: buyers },
              { name: "expected", label: "Expected delivery", type: "date", required: true },
              { name: "value", label: "Order value (ZAR)", type: "number", required: true },
              { name: "notes", label: "Supplier instructions", type: "textarea" },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Purchase orders"
          value={formatNumber(purchaseOrders.length)}
          hint="All statuses"
          icon={FileStack}
        />
        <KpiCard label="Committed value" value={formatMoney(committed)} hint="Including VAT" icon={Wallet} />
        <KpiCard
          label="Awaiting delivery"
          value={formatNumber(awaiting.length)}
          hint="Approved or transmitted"
          icon={FileStack}
        />
        <KpiCard
          label="Fully received"
          value={formatNumber(received.length)}
          hint="Closed against goods receipts"
          icon={PackageCheck}
        />
      </section>

      <SectionCard title="Purchase order register">
        <DataTable
          data={purchaseOrders}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.supplierName} ${row.buyer} ${row.category}`}
          searchPlaceholder="Search purchase orders or suppliers"
          rowHref={(row) => `/purchase-orders/${row.id}`}
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(purchaseOrders, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "category",
              label: "Category",
              options: uniqueValues(purchaseOrders, (row) => row.category),
              getValue: (row) => row.category,
            },
            {
              id: "buyer",
              label: "Buyer",
              options: uniqueValues(purchaseOrders, (row) => row.buyer),
              getValue: (row) => row.buyer,
            },
            {
              id: "warehouse",
              label: "Warehouse",
              options: uniqueValues(purchaseOrders, (row) => row.warehouseName),
              getValue: (row) => row.warehouseName,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
