"use client";

import { AlertTriangle, Boxes, PackageX, ShieldCheck } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoActionButton } from "@/components/erp/demo-actions";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { inventoryRecords, inventorySummary } from "@/data/erp/inventory";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { InventoryRecord } from "@/types/erp";

const specs: ColumnSpec<InventoryRecord>[] = [
  { id: "sku", header: "SKU", kind: "link", value: (row) => row.sku, href: (row) => `/products/${row.productId}` },
  { id: "product", header: "Product", kind: "strong", value: (row) => row.productName },
  { id: "warehouse", header: "Warehouse", kind: "muted", value: (row) => row.warehouseName },
  { id: "bin", header: "Bin", kind: "muted", value: (row) => row.binLocation },
  { id: "onHand", header: "On hand", kind: "number", align: "right", value: (row) => row.onHand },
  { id: "reserved", header: "Reserved", kind: "number", align: "right", value: (row) => row.reserved },
  { id: "available", header: "Available", kind: "number", align: "right", value: (row) => row.available },
  { id: "reorder", header: "Reorder level", kind: "number", align: "right", value: (row) => row.reorderLevel },
  { id: "counted", header: "Last counted", kind: "date", value: (row) => row.lastCountedAt },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function StockLevelsPage() {
  const healthy = inventoryRecords.filter((record) => record.status === "In Stock").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Levels"
        description="Live stock position by SKU and warehouse with reservation and replenishment thresholds."
        breadcrumbs={[{ label: "Inventory", href: "/inventory" }, { label: "Stock Levels" }]}
        actions={
          <DemoActionButton
            size="sm"
            message="Demo changes applied."
            description="A replenishment worksheet was prepared for the flagged lines."
          >
            Generate replenishment
          </DemoActionButton>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Stocked lines"
          value={formatNumber(inventorySummary.totalRecords)}
          hint={`${healthy} within tolerance`}
          icon={Boxes}
        />
        <KpiCard
          label="Reserved units"
          value={formatNumber(inventorySummary.reserved)}
          hint="Committed to open orders"
          icon={ShieldCheck}
        />
        <KpiCard
          label="Low stock lines"
          value={formatNumber(inventorySummary.lowStock)}
          hint="Below reorder level"
          icon={AlertTriangle}
        />
        <KpiCard
          label="Out of stock"
          value={formatNumber(inventorySummary.outOfStock)}
          hint={`Value at risk ${formatMoney(inventorySummary.totalValue * 0.02)}`}
          icon={PackageX}
        />
      </section>

      <SectionCard title="Stock level register">
        <DataTable
          data={inventoryRecords}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.sku} ${row.productName} ${row.warehouseName} ${row.binLocation}`}
          searchPlaceholder="Search SKUs, products or bins"
          rowHref={(row) => `/products/${row.productId}`}
          pageSize={20}
          filters={[
            {
              id: "warehouse",
              label: "Warehouse",
              options: uniqueValues(inventoryRecords, (row) => row.warehouseName),
              getValue: (row) => row.warehouseName,
            },
            {
              id: "status",
              label: "Status",
              options: uniqueValues(inventoryRecords, (row) => row.status),
              getValue: (row) => row.status,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
