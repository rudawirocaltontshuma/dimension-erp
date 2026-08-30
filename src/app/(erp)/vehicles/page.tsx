"use client";

import { Plus, Truck, Wrench } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { drivers, vehicles } from "@/data/erp/logistics";
import { formatNumber } from "@/lib/erp/format";
import type { Vehicle } from "@/types/erp";

const specs: ColumnSpec<Vehicle>[] = [
  { id: "id", header: "Vehicle", kind: "strong", value: (row) => row.id },
  { id: "registration", header: "Registration", value: (row) => row.registration },
  { id: "type", header: "Type", kind: "muted", value: (row) => row.type },
  { id: "make", header: "Make & model", kind: "muted", value: (row) => `${row.make} ${row.model}` },
  { id: "driver", header: "Driver", kind: "muted", value: (row) => row.driver },
  { id: "location", header: "Location", kind: "muted", value: (row) => row.currentLocation },
  { id: "mileage", header: "Mileage (km)", kind: "number", align: "right", value: (row) => row.mileageKm },
  { id: "capacity", header: "Capacity (kg)", kind: "number", align: "right", value: (row) => row.capacityKg },
  { id: "service", header: "Last service", kind: "date", value: (row) => row.lastServiceDate },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function VehiclesPage() {
  const available = vehicles.filter((vehicle) => vehicle.status === "Available");
  const inTransit = vehicles.filter((vehicle) => vehicle.status === "In Transit");
  const maintenance = vehicles.filter((vehicle) => vehicle.status === "Maintenance");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicles"
        description="Fleet register with driver assignment, mileage, capacity and maintenance position."
        breadcrumbs={[{ label: "Logistics", href: "/logistics" }, { label: "Vehicles" }]}
        actions={
          <DemoFormDialog
            title="New vehicle"
            description="Add a demonstration vehicle to the fleet register."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New vehicle
              </Button>
            }
            fields={[
              { name: "registration", label: "Registration", required: true },
              { name: "type", label: "Vehicle type", type: "select", required: true, options: ["Panel Van", "Rigid Truck", "Refrigerated Truck", "Bakkie", "Interlink"] },
              { name: "make", label: "Make", required: true },
              { name: "model", label: "Model", required: true },
              { name: "driver", label: "Assigned driver", type: "select", options: drivers },
              { name: "capacity", label: "Capacity (kg)", type: "number" },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Fleet size" value={formatNumber(vehicles.length)} hint="All vehicle classes" icon={Truck} />
        <KpiCard label="Available" value={formatNumber(available.length)} hint="Ready for dispatch" icon={Truck} />
        <KpiCard label="In transit" value={formatNumber(inTransit.length)} hint="Currently on delivery" icon={Truck} />
        <KpiCard label="In maintenance" value={formatNumber(maintenance.length)} hint="Scheduled or unplanned" icon={Wrench} />
      </section>

      <SectionCard title="Fleet register">
        <DataTable
          data={vehicles}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.id} ${row.registration} ${row.make} ${row.model} ${row.driver}`}
          searchPlaceholder="Search vehicles, registrations or drivers"
          filters={[
            { id: "status", label: "Status", options: uniqueValues(vehicles, (row) => row.status), getValue: (row) => row.status },
            { id: "type", label: "Type", options: uniqueValues(vehicles, (row) => row.type), getValue: (row) => row.type },
          ]}
        />
      </SectionCard>
    </div>
  );
}
