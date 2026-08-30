import Link from "next/link";
import { notFound } from "next/navigation";

import { ProgressMeter } from "@/components/erp/charts";
import { InfoGrid, SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inventoryRecords, stockMovements, stockTransfers } from "@/data/erp/inventory";
import { warehouses } from "@/data/erp/organisation";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export function generateStaticParams() {
  return warehouses.map((warehouse) => ({ id: warehouse.id }));
}

export default async function WarehouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const warehouse = warehouses.find((entry) => entry.id === id);
  if (!warehouse) notFound();

  const records = inventoryRecords.filter((record) => record.warehouseId === warehouse.id);
  const lowStock = records.filter((record) => record.status === "Low Stock" || record.status === "Out of Stock");
  const movements = stockMovements.filter((movement) => movement.warehouseName === warehouse.name).slice(0, 10);
  const transfers = stockTransfers.filter(
    (transfer) => transfer.sourceWarehouse === warehouse.name || transfer.destinationWarehouse === warehouse.name,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={warehouse.name}
        description={`${warehouse.code} · ${warehouse.city}, ${warehouse.province} · managed by ${warehouse.manager}`}
        breadcrumbs={[
          { label: "Operations", href: "/dashboard" },
          { label: "Warehouses", href: "/warehouses" },
          { label: warehouse.code },
        ]}
        meta={
          <div className="pt-1">
            <StatusBadge status={warehouse.status} />
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Utilisation"
          value={formatPercent(warehouse.utilization)}
          hint={`${formatNumber(warehouse.usedPallets)} pallets in use`}
        />
        <KpiCard
          label="Stock value"
          value={formatMoney(warehouse.stockValue)}
          hint={`${formatNumber(records.length)} stocked lines`}
        />
        <KpiCard
          label="Throughput"
          value={formatNumber(warehouse.inboundThisWeek + warehouse.outboundThisWeek)}
          hint="Inbound and outbound this week"
        />
        <KpiCard label="Low stock lines" value={formatNumber(lowStock.length)} hint="Requires replenishment" />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Facility details" className="lg:col-span-2">
          <InfoGrid
            columns={3}
            items={[
              { label: "Code", value: warehouse.code },
              { label: "Manager", value: warehouse.manager },
              { label: "Telephone", value: warehouse.phone },
              { label: "Address", value: `${warehouse.address.line1}, ${warehouse.address.line2 ?? ""}` },
              { label: "City", value: `${warehouse.address.city}, ${warehouse.address.province}` },
              { label: "Postal code", value: warehouse.address.postalCode },
              { label: "Capacity", value: `${formatNumber(warehouse.capacityPallets)} pallets` },
              { label: "In use", value: `${formatNumber(warehouse.usedPallets)} pallets` },
              { label: "Products stocked", value: formatNumber(warehouse.productCount) },
            ]}
          />
        </SectionCard>
        <SectionCard title="Weekly activity">
          <div className="space-y-4">
            <ProgressMeter label="Capacity utilisation" value={warehouse.utilization} max={100} />
            <div className="space-y-1">
              <StatRow label="Inbound receipts" value={formatNumber(warehouse.inboundThisWeek)} />
              <StatRow label="Outbound dispatches" value={formatNumber(warehouse.outboundThisWeek)} />
              <StatRow
                label="Open transfers"
                value={formatNumber(transfers.filter((transfer) => transfer.status !== "Completed").length)}
              />
              <StatRow label="Low stock lines" value={formatNumber(warehouse.lowStockItems)} />
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent movements" description="Latest stock postings at this facility.">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-medium">{movement.reference}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(movement.date)}</TableCell>
                  <TableCell>{movement.productName}</TableCell>
                  <TableCell>
                    <StatusBadge status={movement.type} tone="info" />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(movement.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Low stock at this facility" description="Lines at or below the reorder level.">
        <ul className="divide-y">
          {lowStock.slice(0, 10).map((record) => (
            <li key={record.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <Link
                  prefetch={false}
                  href={`/products/${record.productId}`}
                  className="font-medium text-sm hover:underline"
                >
                  {record.productName}
                </Link>
                <p className="text-muted-foreground text-xs">
                  {record.sku} · bin {record.binLocation}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs tabular-nums">
                  {formatNumber(record.available)} / {formatNumber(record.reorderLevel)}
                </span>
                <StatusBadge status={record.status} />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
