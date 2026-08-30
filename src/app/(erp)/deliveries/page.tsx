"use client";

import { CalendarClock, CheckCircle2, PackageX, Truck } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { deliveries } from "@/data/erp/logistics";
import { formatNumber } from "@/lib/erp/format";
import type { Delivery } from "@/types/erp";

const specs: ColumnSpec<Delivery>[] = [
  { id: "reference", header: "Delivery", kind: "strong", value: (row) => row.reference },
  {
    id: "shipment",
    header: "Shipment",
    kind: "link",
    value: (row) => row.shipmentRef,
    href: (row) => `/shipments/${row.shipmentRef}`,
  },
  { id: "customer", header: "Customer", value: (row) => row.customerName },
  { id: "address", header: "Destination", kind: "muted", value: (row) => row.address },
  { id: "region", header: "Region", kind: "muted", value: (row) => row.region },
  { id: "scheduled", header: "Scheduled", kind: "date", value: (row) => row.scheduledDate },
  { id: "window", header: "Window", kind: "muted", value: (row) => row.timeWindow },
  { id: "driver", header: "Driver", kind: "muted", value: (row) => row.driver },
  { id: "pod", header: "Proof of delivery", kind: "muted", value: (row) => row.proofOfDelivery },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function DeliveriesPage() {
  const completed = deliveries.filter((delivery) => delivery.status === "Completed");
  const scheduled = deliveries.filter((delivery) => delivery.status === "Scheduled");
  const failed = deliveries.filter((delivery) => delivery.status === "Failed");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deliveries"
        description="Scheduled delivery runs with time windows, drivers and proof of delivery capture."
        breadcrumbs={[{ label: "Logistics", href: "/logistics" }, { label: "Deliveries" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Delivery runs" value={formatNumber(deliveries.length)} hint="Current schedule" icon={Truck} />
        <KpiCard
          label="Completed"
          value={formatNumber(completed.length)}
          hint="Proof of delivery captured"
          icon={CheckCircle2}
        />
        <KpiCard
          label="Scheduled"
          value={formatNumber(scheduled.length)}
          hint="Planned for delivery"
          icon={CalendarClock}
        />
        <KpiCard
          label="Failed attempts"
          value={formatNumber(failed.length)}
          hint="Requires rescheduling"
          icon={PackageX}
        />
      </section>

      <SectionCard title="Delivery register">
        <DataTable
          data={deliveries}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.shipmentRef} ${row.customerName} ${row.driver} ${row.region}`}
          searchPlaceholder="Search deliveries, customers or drivers"
          pageSize={20}
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(deliveries, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "region",
              label: "Region",
              options: uniqueValues(deliveries, (row) => row.region),
              getValue: (row) => row.region,
            },
            {
              id: "driver",
              label: "Driver",
              options: uniqueValues(deliveries, (row) => row.driver),
              getValue: (row) => row.driver,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
