"use client";

import { ClipboardCheck, Scale, TrendingDown, TrendingUp } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoActionButton } from "@/components/erp/demo-actions";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { stockAdjustments } from "@/data/erp/inventory";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { StockAdjustment } from "@/types/erp";

const specs: ColumnSpec<StockAdjustment>[] = [
  { id: "reference", header: "Adjustment", kind: "strong", value: (row) => row.reference },
  { id: "date", header: "Date", kind: "date", value: (row) => row.date },
  { id: "warehouse", header: "Warehouse", kind: "muted", value: (row) => row.warehouseName },
  { id: "sku", header: "SKU", kind: "muted", value: (row) => row.productSku },
  { id: "product", header: "Product", value: (row) => row.productName },
  { id: "quantity", header: "Quantity change", kind: "number", align: "right", value: (row) => row.quantityDelta },
  { id: "value", header: "Value change", kind: "money", align: "right", value: (row) => row.valueDelta },
  { id: "reason", header: "Reason", kind: "muted", value: (row) => row.reason },
  { id: "approvedBy", header: "Approved by", kind: "muted", value: (row) => row.approvedBy },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function AdjustmentsPage() {
  const positive = stockAdjustments.filter((entry) => entry.quantityDelta > 0);
  const negative = stockAdjustments.filter((entry) => entry.quantityDelta < 0);
  const netValue = stockAdjustments.reduce((sum, entry) => sum + entry.valueDelta, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Adjustments"
        description="Cycle counts, damages, expiries and reclassifications posted against warehouse stock."
        breadcrumbs={[{ label: "Inventory", href: "/inventory" }, { label: "Adjustments" }]}
        actions={
          <DemoActionButton
            size="sm"
            message="Demo changes applied."
            description="A cycle count worksheet was prepared."
          >
            Start cycle count
          </DemoActionButton>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Adjustments"
          value={formatNumber(stockAdjustments.length)}
          hint="Rolling 120 days"
          icon={Scale}
        />
        <KpiCard
          label="Positive variances"
          value={formatNumber(positive.length)}
          hint="Found or reclassified stock"
          icon={TrendingUp}
        />
        <KpiCard
          label="Negative variances"
          value={formatNumber(negative.length)}
          hint="Damage, expiry and shrinkage"
          icon={TrendingDown}
        />
        <KpiCard label="Net value impact" value={formatMoney(netValue)} hint="At standard cost" icon={ClipboardCheck} />
      </section>

      <SectionCard title="Adjustment register">
        <DataTable
          data={stockAdjustments}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) =>
            `${row.reference} ${row.productSku} ${row.productName} ${row.reason} ${row.approvedBy}`
          }
          searchPlaceholder="Search adjustments or products"
          filters={[
            {
              id: "reason",
              label: "Reason",
              options: uniqueValues(stockAdjustments, (row) => row.reason),
              getValue: (row) => row.reason,
            },
            {
              id: "warehouse",
              label: "Warehouse",
              options: uniqueValues(stockAdjustments, (row) => row.warehouseName),
              getValue: (row) => row.warehouseName,
            },
            {
              id: "status",
              label: "Status",
              options: uniqueValues(stockAdjustments, (row) => row.status),
              getValue: (row) => row.status,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
