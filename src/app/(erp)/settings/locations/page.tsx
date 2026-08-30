"use client";

import { Plus } from "lucide-react";

import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { locations } from "@/data/erp/organisation";
import { formatNumber } from "@/lib/erp/format";

export default function LocationsSettingsPage() {
  return (
    <SectionCard
      title="Locations"
      description="Operating sites used for stock, dispatch, employment and reporting."
      action={
        <DemoFormDialog
          title="New location"
          description="Register a demonstration operating site."
          trigger={
            <Button size="sm">
              <Plus data-icon="inline-start" />
              New location
            </Button>
          }
          fields={[
            { name: "name", label: "Location name", required: true },
            {
              name: "type",
              label: "Type",
              type: "select",
              required: true,
              options: ["Head Office", "Distribution Centre", "Warehouse", "Manufacturing", "Branch"],
            },
            { name: "city", label: "City", required: true },
            { name: "province", label: "Province", required: true },
            { name: "manager", label: "Site manager", required: true },
          ]}
        />
      }
    >
      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead className="text-right">Headcount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell className="text-muted-foreground">{location.type}</TableCell>
                <TableCell>{location.city}</TableCell>
                <TableCell className="text-muted-foreground">{location.province}</TableCell>
                <TableCell className="text-muted-foreground">{location.manager}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(location.headcount)}</TableCell>
                <TableCell>
                  <StatusBadge status={location.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
