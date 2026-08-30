"use client";

import { MapPin, Route as RouteIcon, Timer, Truck } from "lucide-react";

import { ChartCard, ErpBarChart } from "@/components/erp/charts";
import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { deliveryRoutes, driverRoster } from "@/data/erp/logistics";
import { formatNumber } from "@/lib/erp/format";
import type { DeliveryRoute } from "@/types/erp";

const specs: ColumnSpec<DeliveryRoute>[] = [
  { id: "code", header: "Route", kind: "strong", value: (row) => row.code },
  { id: "name", header: "Name", value: (row) => row.name },
  { id: "region", header: "Region", kind: "muted", value: (row) => row.region },
  { id: "driver", header: "Driver", kind: "muted", value: (row) => row.driver },
  { id: "vehicle", header: "Vehicle", kind: "muted", value: (row) => row.vehicleId },
  { id: "departure", header: "Departure", kind: "muted", value: (row) => row.departureTime },
  { id: "stops", header: "Stops", kind: "number", align: "right", value: (row) => row.stops },
  { id: "distance", header: "Distance (km)", kind: "number", align: "right", value: (row) => row.distanceKm },
  { id: "hours", header: "Est. hours", kind: "number", align: "right", value: (row) => row.estimatedHours },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function RoutesPage() {
  const active = deliveryRoutes.filter((route) => route.status === "Active");
  const stops = deliveryRoutes.reduce((sum, route) => sum + route.stops, 0);
  const distance = deliveryRoutes.reduce((sum, route) => sum + route.distanceKm, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Routes"
        description="Planned distribution routes with stop counts, distance and driver assignment."
        breadcrumbs={[{ label: "Logistics", href: "/logistics" }, { label: "Routes" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Routes" value={formatNumber(deliveryRoutes.length)} hint="Across all regions" icon={RouteIcon} />
        <KpiCard label="Active routes" value={formatNumber(active.length)} hint="Currently running" icon={Truck} />
        <KpiCard label="Planned stops" value={formatNumber(stops)} hint="All routes" icon={MapPin} />
        <KpiCard label="Planned distance" value={`${formatNumber(distance)} km`} hint="Across the schedule" icon={Timer} />
      </section>

      <ChartCard title="Distance by route" description="Planned kilometres per route.">
        <ErpBarChart
          data={deliveryRoutes.map((route) => ({ route: route.code, distance: route.distanceKm }))}
          xKey="route"
          series={[{ key: "distance", label: "Distance (km)" }]}
          height={260}
        />
      </ChartCard>

      <SectionCard title="Route register">
        <DataTable
          data={deliveryRoutes}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.code} ${row.name} ${row.region} ${row.driver}`}
          searchPlaceholder="Search routes, regions or drivers"
          filters={[
            { id: "status", label: "Status", options: uniqueValues(deliveryRoutes, (row) => row.status), getValue: (row) => row.status },
            { id: "region", label: "Region", options: uniqueValues(deliveryRoutes, (row) => row.region), getValue: (row) => row.region },
          ]}
        />
      </SectionCard>

      <SectionCard title="Driver roster" description="Driver, vehicle and shift assignment for the current schedule.">
        <ul className="divide-y">
          {driverRoster.map((entry) => (
            <li key={entry.driver} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
              <div>
                <p className="font-medium text-sm">{entry.driver}</p>
                <p className="text-muted-foreground text-xs">
                  {entry.vehicle} · {entry.assignedRoute} · {entry.shift}
                </p>
              </div>
              <span className="text-muted-foreground text-xs">{entry.contact}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
