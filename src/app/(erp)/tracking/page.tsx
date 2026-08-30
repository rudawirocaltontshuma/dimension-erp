"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { Radar, Search, Truck } from "lucide-react";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import { InfoGrid, SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { EmptyState } from "@/components/erp/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logisticsSummary, shipments } from "@/data/erp/logistics";
import { formatDate, formatNumber, formatPercent } from "@/lib/erp/format";
import { cn } from "@/lib/utils";

const TRACKABLE = shipments.filter((shipment) => shipment.status !== "Delivered");

export default function TrackingPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(TRACKABLE[0]?.id ?? shipments[0].id);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const pool = term ? shipments : TRACKABLE;
    return pool
      .filter((shipment) =>
        term
          ? `${shipment.reference} ${shipment.customerName} ${shipment.orderRef} ${shipment.destination}`
              .toLowerCase()
              .includes(term)
          : true,
      )
      .slice(0, 20);
  }, [query]);

  const selected = shipments.find((shipment) => shipment.id === selectedId) ?? shipments[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tracking"
        description="Track any consignment in the demonstration network from dispatch through to proof of delivery."
        breadcrumbs={[{ label: "Logistics", href: "/logistics" }, { label: "Tracking" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active consignments" value={formatNumber(TRACKABLE.length)} hint="Not yet delivered" icon={Radar} />
        <KpiCard label="In transit" value={formatNumber(logisticsSummary.inTransit)} hint="On the road" icon={Truck} />
        <KpiCard label="Out for delivery" value={formatNumber(logisticsSummary.outForDelivery)} hint="Final delivery run" icon={Truck} />
        <KpiCard label="On-time rate" value={formatPercent(logisticsSummary.onTimeRate)} hint="Rolling six weeks" icon={Radar} />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Find a consignment" description="Search by shipment, order, customer or destination.">
          <div className="space-y-4">
            <div className="relative">
              <Search aria-hidden className="-translate-y-1/2 absolute top-1/2 left-2.5 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="SHP-44100, ORD-10482 or customer"
                aria-label="Search consignments"
                className="pl-8"
              />
            </div>
            {results.length === 0 ? (
              <EmptyState
                title="No consignments found"
                description="No shipment in the demonstration dataset matches that search term."
                action={
                  <Button variant="outline" size="sm" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                }
              />
            ) : (
              <ul className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                {results.map((shipment) => (
                  <li key={shipment.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(shipment.id)}
                      className={cn(
                        "w-full rounded-md border p-3 text-left transition-colors hover:bg-muted/60",
                        shipment.id === selectedId && "border-primary bg-primary/5",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{shipment.reference}</span>
                        <StatusBadge status={shipment.status} />
                      </div>
                      <p className="truncate text-muted-foreground text-xs">
                        {shipment.customerName} · {shipment.destination}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SectionCard>

        <div className="space-y-4 lg:col-span-2">
          <SectionCard
            title={`Consignment ${selected.reference}`}
            description={`${selected.origin} → ${selected.destination}`}
            action={
              <Button asChild variant="outline" size="sm">
                <Link prefetch={false} href={`/shipments/${selected.id}`}>
                  Open shipment
                </Link>
              </Button>
            }
          >
            <div className="space-y-4">
              <StatusBadge status={selected.status} />
              <InfoGrid
                columns={3}
                items={[
                  { label: "Customer", value: selected.customerName },
                  { label: "Sales order", value: selected.orderRef },
                  { label: "Carrier", value: selected.carrier },
                  { label: "Driver", value: selected.driver },
                  { label: "Vehicle", value: selected.vehicleId },
                  { label: "Service level", value: selected.serviceLevel },
                  { label: "Dispatched", value: formatDate(selected.dispatchDate) },
                  { label: "Expected delivery", value: formatDate(selected.expectedDelivery) },
                  { label: "Packages", value: `${formatNumber(selected.packages)} · ${selected.weightKg} kg` },
                ]}
              />
            </div>
          </SectionCard>

          <SectionCard title="Tracking history" description="Milestones recorded against this consignment.">
            <ActivityTimeline events={selected.timeline} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
