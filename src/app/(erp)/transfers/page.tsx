"use client";

import { Container, Plus, Truck } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { stockTransfers } from "@/data/erp/inventory";
import { warehouses } from "@/data/erp/organisation";
import { formatNumber } from "@/lib/erp/format";
import type { StockTransfer } from "@/types/erp";

const specs: ColumnSpec<StockTransfer>[] = [
  { id: "reference", header: "Transfer", kind: "strong", value: (row) => row.reference },
  { id: "source", header: "Source", kind: "muted", value: (row) => row.sourceWarehouse },
  { id: "destination", header: "Destination", kind: "muted", value: (row) => row.destinationWarehouse },
  { id: "requested", header: "Requested", kind: "date", value: (row) => row.requestedDate },
  { id: "expected", header: "Expected", kind: "date", value: (row) => row.expectedDate },
  { id: "items", header: "Items", kind: "number", align: "right", value: (row) => row.itemCount },
  { id: "quantity", header: "Quantity", kind: "number", align: "right", value: (row) => row.totalQuantity },
  { id: "requestedBy", header: "Requested by", kind: "muted", value: (row) => row.requestedBy },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function TransfersPage() {
  const inTransit = stockTransfers.filter((transfer) => transfer.status === "In Transit").length;
  const completed = stockTransfers.filter((transfer) => transfer.status === "Completed").length;
  const units = stockTransfers.reduce((sum, transfer) => sum + transfer.totalQuantity, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Transfers"
        description="Inter-warehouse replenishment requests moving stock between Enterprise distribution points."
        breadcrumbs={[{ label: "Inventory", href: "/inventory" }, { label: "Transfers" }]}
        actions={
          <DemoFormDialog
            title="New stock transfer"
            description="Raise a demonstration transfer between two warehouses."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New transfer
              </Button>
            }
            fields={[
              {
                name: "source",
                label: "Source warehouse",
                type: "select",
                required: true,
                options: warehouses.map((warehouse) => warehouse.name),
              },
              {
                name: "destination",
                label: "Destination warehouse",
                type: "select",
                required: true,
                options: warehouses.map((warehouse) => warehouse.name),
              },
              { name: "expected", label: "Expected date", type: "date", required: true },
              { name: "quantity", label: "Total quantity", type: "number", required: true },
              { name: "notes", label: "Notes", type: "textarea" },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Transfers" value={formatNumber(stockTransfers.length)} hint="All statuses" icon={Container} />
        <KpiCard label="In transit" value={formatNumber(inTransit)} hint="Currently on the road" icon={Truck} />
        <KpiCard label="Completed" value={formatNumber(completed)} hint="Received at destination" icon={Container} />
        <KpiCard label="Units moved" value={formatNumber(units)} hint="Across all transfers" icon={Container} />
      </section>

      <SectionCard title="Transfer register" description="Display-only view of inter-warehouse movements.">
        <DataTable
          data={stockTransfers}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) =>
            `${row.reference} ${row.sourceWarehouse} ${row.destinationWarehouse} ${row.requestedBy}`
          }
          searchPlaceholder="Search transfers or warehouses"
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(stockTransfers, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "source",
              label: "Source",
              options: uniqueValues(stockTransfers, (row) => row.sourceWarehouse),
              getValue: (row) => row.sourceWarehouse,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
