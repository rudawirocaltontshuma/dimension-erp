"use client";

import { ClipboardCheck, PackageCheck, PackageX, Truck } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { goodsReceipts } from "@/data/erp/procurement";
import { formatNumber, formatPercent } from "@/lib/erp/format";
import type { GoodsReceipt } from "@/types/erp";

const specs: ColumnSpec<GoodsReceipt>[] = [
  { id: "reference", header: "GRN", kind: "strong", value: (row) => row.reference },
  {
    id: "po",
    header: "Purchase order",
    kind: "link",
    value: (row) => row.purchaseOrderRef,
    href: (row) => `/purchase-orders/${row.purchaseOrderRef}`,
  },
  { id: "supplier", header: "Supplier", value: (row) => row.supplierName },
  { id: "warehouse", header: "Warehouse", kind: "muted", value: (row) => row.warehouseName },
  { id: "received", header: "Received", kind: "date", value: (row) => row.receivedDate },
  { id: "receivedBy", header: "Received by", kind: "muted", value: (row) => row.receivedBy },
  { id: "items", header: "Items", kind: "number", align: "right", value: (row) => row.itemCount },
  { id: "quantity", header: "Qty received", kind: "number", align: "right", value: (row) => row.quantityReceived },
  { id: "ordered", header: "Qty ordered", kind: "number", align: "right", value: (row) => row.quantityOrdered },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function GoodsReceiptsPage() {
  const completed = goodsReceipts.filter((receipt) => receipt.status === "Completed");
  const partial = goodsReceipts.filter((receipt) => receipt.status === "Partially Received");
  const rejected = goodsReceipts.filter((receipt) => receipt.status === "Rejected");
  const receivedUnits = goodsReceipts.reduce((sum, receipt) => sum + receipt.quantityReceived, 0);
  const orderedUnits = goodsReceipts.reduce((sum, receipt) => sum + receipt.quantityOrdered, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goods Receipts"
        description="Inbound deliveries booked against purchase orders at each receiving warehouse."
        breadcrumbs={[{ label: "Procurement", href: "/procurement" }, { label: "Goods Receipts" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Receipts"
          value={formatNumber(goodsReceipts.length)}
          hint="Rolling 120 days"
          icon={PackageCheck}
        />
        <KpiCard
          label="Fill rate"
          value={formatPercent((receivedUnits / orderedUnits) * 100)}
          hint="Received against ordered"
          icon={Truck}
        />
        <KpiCard
          label="Partially received"
          value={formatNumber(partial.length)}
          hint="Awaiting balance delivery"
          icon={ClipboardCheck}
        />
        <KpiCard
          label="Rejected"
          value={formatNumber(rejected.length)}
          hint={`${completed.length} completed receipts`}
          icon={PackageX}
        />
      </section>

      <SectionCard title="Goods receipt register">
        <DataTable
          data={goodsReceipts}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.purchaseOrderRef} ${row.supplierName} ${row.receivedBy}`}
          searchPlaceholder="Search receipts, orders or suppliers"
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(goodsReceipts, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "warehouse",
              label: "Warehouse",
              options: uniqueValues(goodsReceipts, (row) => row.warehouseName),
              getValue: (row) => row.warehouseName,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
