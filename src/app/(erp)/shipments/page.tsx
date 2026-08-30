"use client";

import { AlertTriangle, PackageCheck, Plus, Truck } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { carriers, drivers, logisticsSummary, shipments } from "@/data/erp/logistics";
import { warehouses } from "@/data/erp/organisation";
import { formatNumber, formatPercent } from "@/lib/erp/format";
import type { Shipment } from "@/types/erp";

const specs: ColumnSpec<Shipment>[] = [
  { id: "reference", header: "Shipment", kind: "link", value: (row) => row.reference, href: (row) => `/shipments/${row.id}` },
  { id: "order", header: "Order", kind: "link", value: (row) => row.orderRef, href: (row) => `/orders/${row.orderRef}` },
  { id: "customer", header: "Customer", kind: "strong", value: (row) => row.customerName },
  { id: "origin", header: "Origin", kind: "muted", value: (row) => row.origin },
  { id: "destination", header: "Destination", kind: "muted", value: (row) => row.destination },
  { id: "carrier", header: "Carrier", kind: "muted", value: (row) => row.carrier },
  { id: "service", header: "Service", kind: "muted", value: (row) => row.serviceLevel },
  { id: "expected", header: "Expected", kind: "date", value: (row) => row.expectedDelivery },
  { id: "packages", header: "Packages", kind: "number", align: "right", value: (row) => row.packages },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function ShipmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipments"
        description="Outbound consignments across carriers, service levels and delivery regions."
        breadcrumbs={[{ label: "Logistics", href: "/logistics" }, { label: "Shipments" }]}
        actions={
          <DemoFormDialog
            title="New shipment"
            description="Create a demonstration consignment for an existing order."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New shipment
              </Button>
            }
            fields={[
              { name: "order", label: "Sales order", required: true, placeholder: "ORD-10482" },
              { name: "origin", label: "Origin", type: "select", required: true, options: warehouses.map((warehouse) => warehouse.name) },
              { name: "destination", label: "Destination", required: true },
              { name: "carrier", label: "Carrier", type: "select", options: carriers },
              { name: "driver", label: "Driver", type: "select", options: drivers },
              { name: "expected", label: "Expected delivery", type: "date", required: true },
              { name: "service", label: "Service level", type: "select", options: ["Standard", "Express", "Overnight", "Economy"] },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Shipments" value={formatNumber(shipments.length)} hint="Rolling 60 days" icon={Truck} />
        <KpiCard label="In transit" value={formatNumber(logisticsSummary.inTransit)} hint="On the road now" icon={Truck} />
        <KpiCard label="Delivered" value={formatNumber(logisticsSummary.delivered)} hint={`On-time ${formatPercent(logisticsSummary.onTimeRate)}`} icon={PackageCheck} />
        <KpiCard label="Delayed" value={formatNumber(logisticsSummary.delayed)} hint="Customer notified" icon={AlertTriangle} />
      </section>

      <SectionCard title="Shipment register" description="Select a row to open the consignment tracking view.">
        <DataTable
          data={shipments}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.orderRef} ${row.customerName} ${row.carrier} ${row.destination}`}
          searchPlaceholder="Search shipments, orders or customers"
          rowHref={(row) => `/shipments/${row.id}`}
          pageSize={20}
          filters={[
            { id: "status", label: "Status", options: uniqueValues(shipments, (row) => row.status), getValue: (row) => row.status },
            { id: "carrier", label: "Carrier", options: uniqueValues(shipments, (row) => row.carrier), getValue: (row) => row.carrier },
            { id: "origin", label: "Origin", options: uniqueValues(shipments, (row) => row.origin), getValue: (row) => row.origin },
            { id: "service", label: "Service", options: uniqueValues(shipments, (row) => row.serviceLevel), getValue: (row) => row.serviceLevel },
          ]}
        />
      </SectionCard>
    </div>
  );
}
