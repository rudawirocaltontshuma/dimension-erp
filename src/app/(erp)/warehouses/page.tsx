import Link from "next/link";

import { ArrowRight, Boxes, Truck, Warehouse as WarehouseIcon } from "lucide-react";

import { ChartCard, ErpBarChart, ProgressMeter } from "@/components/erp/charts";
import { SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { inventoryByWarehouse } from "@/data/erp/inventory";
import { warehouses } from "@/data/erp/organisation";
import { formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export default function WarehousesPage() {
  const totalCapacity = warehouses.reduce((sum, warehouse) => sum + warehouse.capacityPallets, 0);
  const usedCapacity = warehouses.reduce((sum, warehouse) => sum + warehouse.usedPallets, 0);
  const stockValue = warehouses.reduce((sum, warehouse) => sum + warehouse.stockValue, 0);
  const outbound = warehouses.reduce((sum, warehouse) => sum + warehouse.outboundThisWeek, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses"
        description="Capacity, utilisation and throughput across the Nexora distribution network."
        breadcrumbs={[{ label: "Operations", href: "/dashboard" }, { label: "Warehouses" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Facilities"
          value={formatNumber(warehouses.length)}
          hint="Distribution centres and warehouses"
          icon={WarehouseIcon}
        />
        <KpiCard
          label="Network utilisation"
          value={formatPercent((usedCapacity / totalCapacity) * 100)}
          hint={`${formatNumber(usedCapacity)} of ${formatNumber(totalCapacity)} pallets`}
          icon={Boxes}
        />
        <KpiCard label="Stock value held" value={formatMoney(stockValue)} hint="At standard cost" icon={Boxes} />
        <KpiCard
          label="Outbound this week"
          value={formatNumber(outbound)}
          hint="Dispatches across the network"
          icon={Truck}
        />
      </section>

      <ChartCard title="Stock value by facility" description="Inventory valuation held at each distribution point.">
        <ErpBarChart
          data={inventoryByWarehouse}
          xKey="warehouse"
          money
          series={[{ key: "value", label: "Stock value" }]}
          height={250}
        />
      </ChartCard>

      <section className="grid gap-4 lg:grid-cols-2">
        {warehouses.map((warehouse) => (
          <SectionCard
            key={warehouse.id}
            title={warehouse.name}
            description={`${warehouse.city}, ${warehouse.province} · managed by ${warehouse.manager}`}
            action={
              <Button asChild variant="outline" size="sm">
                <Link prefetch={false} href={`/warehouses/${warehouse.id}`}>
                  Open
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={warehouse.status} />
                <span className="text-muted-foreground text-xs">{warehouse.phone}</span>
              </div>
              <ProgressMeter
                label="Capacity utilisation"
                value={warehouse.utilization}
                max={100}
                hint={`${formatNumber(warehouse.usedPallets)} / ${formatNumber(warehouse.capacityPallets)} pallets`}
              />
              <div className="space-y-1">
                <StatRow label="Products stocked" value={formatNumber(warehouse.productCount)} />
                <StatRow label="Stock value" value={formatMoney(warehouse.stockValue)} />
                <StatRow label="Inbound this week" value={formatNumber(warehouse.inboundThisWeek)} />
                <StatRow label="Outbound this week" value={formatNumber(warehouse.outboundThisWeek)} />
                <StatRow label="Low stock lines" value={formatNumber(warehouse.lowStockItems)} />
              </div>
            </div>
          </SectionCard>
        ))}
      </section>
    </div>
  );
}
