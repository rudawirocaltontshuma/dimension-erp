import Link from "next/link";

import { ArrowRight, AlertTriangle, PackageCheck, Route as RouteIcon, Truck } from "lucide-react";

import { ChartCard, ErpBarChart, ErpPieChart } from "@/components/erp/charts";
import { SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import {
  deliveryPerformance,
  deliveryRoutes,
  logisticsSummary,
  shipments,
  shipmentsByRegion,
  vehicles,
} from "@/data/erp/logistics";
import { formatDate, formatNumber, formatPercent } from "@/lib/erp/format";

export default function LogisticsOverviewPage() {
  const statusSplit = (["Preparing", "In Transit", "Out for Delivery", "Delivered", "Delayed"] as const).map((status) => ({
    name: status,
    value: shipments.filter((shipment) => shipment.status === status).length,
  }));

  const activeRoutes = deliveryRoutes.filter((route) => route.status === "Active");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logistics Overview"
        description="Consignment status, delivery performance, regional distribution and fleet readiness."
        breadcrumbs={[{ label: "Logistics", href: "/logistics" }, { label: "Overview" }]}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link prefetch={false} href="/tracking">
              Live tracking
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Shipments" value={formatNumber(logisticsSummary.totalShipments)} hint="Rolling 60 days" icon={Truck} />
        <KpiCard label="In transit" value={formatNumber(logisticsSummary.inTransit)} hint="Currently on the road" icon={Truck} />
        <KpiCard label="Delivered" value={formatNumber(logisticsSummary.delivered)} hint="Proof of delivery captured" icon={PackageCheck} />
        <KpiCard label="Delayed" value={formatNumber(logisticsSummary.delayed)} hint="Requires customer notice" icon={AlertTriangle} />
        <KpiCard label="Active vehicles" value={formatNumber(logisticsSummary.activeVehicles)} hint={`${vehicles.length} in the fleet`} icon={Truck} />
        <KpiCard label="Active routes" value={formatNumber(logisticsSummary.activeRoutes)} hint={`${deliveryRoutes.length} planned routes`} icon={RouteIcon} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Delivery performance" description="On-time versus late deliveries by week." className="lg:col-span-2">
          <ErpBarChart
            data={deliveryPerformance}
            xKey="week"
            stacked
            series={[
              { key: "onTime", label: "On time" },
              { key: "late", label: "Late" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Shipment status" description="Consignments by current status.">
          <ErpPieChart data={statusSplit} />
        </ChartCard>
      </section>

      <ChartCard title="Regional distribution" description="Consignment volume by destination province.">
        <ErpBarChart data={shipmentsByRegion} xKey="region" series={[{ key: "count", label: "Shipments" }]} height={260} />
      </ChartCard>

      <section className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Recent shipments"
          description="Latest consignments dispatched from the network."
          className="lg:col-span-2"
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/shipments">
                All shipments
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {shipments.slice(0, 8).map((shipment) => (
              <li key={shipment.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <Link prefetch={false} href={`/shipments/${shipment.id}`} className="font-medium text-sm hover:underline">
                    {shipment.reference}
                  </Link>
                  <p className="truncate text-muted-foreground text-xs">
                    {shipment.customerName} · {shipment.origin} → {shipment.destination}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={shipment.status} />
                  <span className="text-muted-foreground text-xs">{formatDate(shipment.expectedDelivery)}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Network summary">
          <div className="space-y-1">
            <StatRow label="On-time delivery" value={formatPercent(logisticsSummary.onTimeRate)} />
            <StatRow label="Out for delivery" value={formatNumber(logisticsSummary.outForDelivery)} />
            <StatRow label="Routes active" value={formatNumber(activeRoutes.length)} />
            <StatRow label="Vehicles in maintenance" value={formatNumber(vehicles.filter((vehicle) => vehicle.status === "Maintenance").length)} />
            <StatRow label="Total stops planned" value={formatNumber(deliveryRoutes.reduce((sum, route) => sum + route.stops, 0))} />
            <StatRow label="Planned distance" value={`${formatNumber(deliveryRoutes.reduce((sum, route) => sum + route.distanceKm, 0))} km`} />
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
