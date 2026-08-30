"use client";

import Link from "next/link";

import { AlertTriangle, Boxes, PackageCheck, PackageX, Truck, Warehouse as WarehouseIcon } from "lucide-react";

import { ChartCard, ErpBarChart, ErpPieChart, ProgressMeter } from "@/components/erp/charts";
import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { inventoryByCategory, inventoryByWarehouse, inventoryRecords, inventorySummary } from "@/data/erp/inventory";
import { warehouses } from "@/data/erp/organisation";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { InventoryRecord } from "@/types/erp";

const specs: ColumnSpec<InventoryRecord>[] = [
  { id: "sku", header: "SKU", kind: "link", value: (row) => row.sku, href: (row) => `/products/${row.productId}` },
  { id: "product", header: "Product", kind: "strong", value: (row) => row.productName },
  { id: "category", header: "Category", kind: "muted", value: (row) => row.category },
  { id: "warehouse", header: "Warehouse", kind: "muted", value: (row) => row.warehouseName },
  { id: "onHand", header: "On hand", kind: "number", align: "right", value: (row) => row.onHand },
  { id: "reserved", header: "Reserved", kind: "number", align: "right", value: (row) => row.reserved },
  { id: "available", header: "Available", kind: "number", align: "right", value: (row) => row.available },
  { id: "reorder", header: "Reorder level", kind: "number", align: "right", value: (row) => row.reorderLevel },
  { id: "value", header: "Stock value", kind: "money", align: "right", value: (row) => row.stockValue },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Overview"
        description="Stock position, valuation and replenishment exposure across every Nexora distribution point."
        breadcrumbs={[{ label: "Inventory", href: "/inventory" }, { label: "Overview" }]}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link prefetch={false} href="/stock-levels">
              Open stock levels
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard
          label="Inventory records"
          value={formatNumber(inventorySummary.totalRecords)}
          hint="SKU / warehouse combinations"
          icon={Boxes}
        />
        <KpiCard
          label="Units on hand"
          value={formatNumber(inventorySummary.totalUnits)}
          hint="All warehouses"
          icon={PackageCheck}
        />
        <KpiCard
          label="Inventory value"
          value={formatMoney(inventorySummary.totalValue)}
          hint="At standard cost"
          icon={Boxes}
        />
        <KpiCard
          label="Low stock"
          value={formatNumber(inventorySummary.lowStock)}
          hint="At or below reorder level"
          icon={AlertTriangle}
        />
        <KpiCard
          label="Out of stock"
          value={formatNumber(inventorySummary.outOfStock)}
          hint="Requires urgent replenishment"
          icon={PackageX}
        />
        <KpiCard
          label="Incoming units"
          value={formatNumber(inventorySummary.incoming)}
          hint="On open purchase orders"
          icon={Truck}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Stock value by warehouse"
          description="Valuation split across distribution points."
          className="lg:col-span-2"
        >
          <ErpBarChart
            data={inventoryByWarehouse}
            xKey="warehouse"
            money
            series={[{ key: "value", label: "Stock value" }]}
            height={250}
          />
        </ChartCard>
        <ChartCard title="Value by category" description="Top categories by stock value.">
          <ErpPieChart
            data={inventoryByCategory.slice(0, 6).map((entry) => ({ name: entry.category, value: entry.value }))}
          />
        </ChartCard>
      </section>

      <SectionCard title="Warehouse utilisation" description="Capacity consumed at each facility.">
        <div className="grid gap-4 sm:grid-cols-2">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-2">
                <Link
                  prefetch={false}
                  href={`/warehouses/${warehouse.id}`}
                  className="font-medium text-sm hover:underline"
                >
                  {warehouse.name}
                </Link>
                <StatusBadge status={warehouse.status} />
              </div>
              <ProgressMeter
                label={`${formatNumber(warehouse.usedPallets)} of ${formatNumber(warehouse.capacityPallets)} pallets`}
                value={warehouse.utilization}
                max={100}
              />
              <p className="text-muted-foreground text-xs">
                <WarehouseIcon aria-hidden className="mr-1 inline size-3" />
                {formatMoney(warehouse.stockValue)} stock value · {warehouse.lowStockItems} low stock lines
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Inventory register"
        description="Every SKU and warehouse combination in the demonstration dataset."
      >
        <DataTable
          data={inventoryRecords}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.sku} ${row.productName} ${row.warehouseName} ${row.category}`}
          searchPlaceholder="Search SKUs, products or warehouses"
          rowHref={(row) => `/products/${row.productId}`}
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
            {
              id: "category",
              label: "Category",
              options: uniqueValues(inventoryRecords, (row) => row.category),
              getValue: (row) => row.category,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
