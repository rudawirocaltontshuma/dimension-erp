"use client";

import { ArrowLeftRight, PackageCheck, PackageMinus, RotateCcw } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { stockMovements } from "@/data/erp/inventory";
import { formatNumber } from "@/lib/erp/format";
import type { StockMovement } from "@/types/erp";

const specs: ColumnSpec<StockMovement>[] = [
  { id: "reference", header: "Reference", kind: "strong", value: (row) => row.reference },
  { id: "date", header: "Date", kind: "date", value: (row) => row.date },
  { id: "sku", header: "SKU", kind: "muted", value: (row) => row.productSku },
  { id: "product", header: "Product", value: (row) => row.productName },
  { id: "warehouse", header: "Warehouse", kind: "muted", value: (row) => row.warehouseName },
  { id: "type", header: "Type", kind: "status", value: (row) => row.type },
  { id: "quantity", header: "Quantity", kind: "number", align: "right", value: (row) => row.quantity },
  { id: "source", header: "Source document", kind: "muted", value: (row) => row.sourceDocument },
  { id: "performedBy", header: "Performed by", kind: "muted", value: (row) => row.performedBy },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function StockMovementsPage() {
  const receipts = stockMovements.filter((movement) => movement.type === "Receipt").length;
  const shipments = stockMovements.filter((movement) => movement.type === "Shipment").length;
  const transfers = stockMovements.filter((movement) => movement.type === "Transfer").length;
  const returns = stockMovements.filter((movement) => movement.type === "Return").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Movements"
        description="Receipts, shipments, transfers, adjustments and returns posted across the warehouse network."
        breadcrumbs={[{ label: "Inventory", href: "/inventory" }, { label: "Stock Movements" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Movements recorded"
          value={formatNumber(stockMovements.length)}
          hint="Rolling 120 days"
          icon={ArrowLeftRight}
        />
        <KpiCard label="Receipts" value={formatNumber(receipts)} hint="Inbound goods bookings" icon={PackageCheck} />
        <KpiCard
          label="Shipments"
          value={formatNumber(shipments)}
          hint="Outbound customer dispatches"
          icon={PackageMinus}
        />
        <KpiCard
          label="Transfers & returns"
          value={formatNumber(transfers + returns)}
          hint={`${transfers} transfers · ${returns} returns`}
          icon={RotateCcw}
        />
      </section>

      <SectionCard title="Movement register">
        <DataTable
          data={stockMovements}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) =>
            `${row.reference} ${row.productSku} ${row.productName} ${row.sourceDocument} ${row.performedBy}`
          }
          searchPlaceholder="Search movements or documents"
          pageSize={20}
          filters={[
            {
              id: "type",
              label: "Type",
              options: uniqueValues(stockMovements, (row) => row.type),
              getValue: (row) => row.type,
            },
            {
              id: "warehouse",
              label: "Warehouse",
              options: uniqueValues(stockMovements, (row) => row.warehouseName),
              getValue: (row) => row.warehouseName,
            },
            {
              id: "status",
              label: "Status",
              options: uniqueValues(stockMovements, (row) => row.status),
              getValue: (row) => row.status,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
