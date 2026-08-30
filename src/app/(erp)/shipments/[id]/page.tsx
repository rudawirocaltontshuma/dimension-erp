import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import { DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { InfoGrid, SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { deliveries, shipments, vehicles } from "@/data/erp/logistics";
import { formatDate, formatNumber } from "@/lib/erp/format";

export function generateStaticParams() {
  return shipments.map((shipment) => ({ id: shipment.id }));
}

export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shipment = shipments.find((entry) => entry.id === id);
  if (!shipment) notFound();

  const vehicle = vehicles.find((entry) => entry.id === shipment.vehicleId);
  const relatedDeliveries = deliveries.filter((delivery) => delivery.shipmentRef === shipment.reference);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Shipment ${shipment.reference}`}
        description={`${shipment.customerName} · ${shipment.origin} → ${shipment.destination}`}
        breadcrumbs={[
          { label: "Logistics", href: "/logistics" },
          { label: "Shipments", href: "/shipments" },
          { label: shipment.reference },
        ]}
        meta={
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={shipment.status} />
            <span className="text-muted-foreground text-xs">Expected {formatDate(shipment.expectedDelivery)}</span>
          </div>
        }
        actions={
          <>
            <PrintButton label="Print waybill" />
            <DemoActionButton size="sm" message="Demo changes applied." description="A customer delivery notification was simulated.">
              Notify customer
            </DemoActionButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Packages" value={formatNumber(shipment.packages)} hint={`${shipment.weightKg} kg total weight`} />
        <KpiCard label="Service level" value={shipment.serviceLevel} hint={shipment.carrier} />
        <KpiCard label="Dispatched" value={formatDate(shipment.dispatchDate)} hint={`Driver ${shipment.driver}`} />
        <KpiCard label="Expected delivery" value={formatDate(shipment.expectedDelivery)} hint={shipment.status} />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Consignment details" className="lg:col-span-2">
          <InfoGrid
            columns={3}
            items={[
              { label: "Shipment", value: shipment.reference },
              {
                label: "Sales order",
                value: (
                  <Link prefetch={false} href={`/orders/${shipment.orderRef}`} className="text-primary hover:underline">
                    {shipment.orderRef}
                  </Link>
                ),
              },
              { label: "Customer", value: shipment.customerName },
              { label: "Origin", value: shipment.origin },
              { label: "Destination", value: shipment.destination },
              { label: "Carrier", value: shipment.carrier },
              { label: "Driver", value: shipment.driver },
              {
                label: "Vehicle",
                value: vehicle ? `${vehicle.registration} (${vehicle.type})` : shipment.vehicleId,
              },
              { label: "Service level", value: shipment.serviceLevel },
            ]}
          />
        </SectionCard>
        <SectionCard title="Consignment summary">
          <div className="space-y-1">
            <StatRow label="Packages" value={formatNumber(shipment.packages)} />
            <StatRow label="Weight" value={`${shipment.weightKg} kg`} />
            <StatRow label="Dispatch date" value={formatDate(shipment.dispatchDate)} />
            <StatRow label="Expected delivery" value={formatDate(shipment.expectedDelivery)} />
            <StatRow label="Linked delivery runs" value={formatNumber(relatedDeliveries.length)} />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Tracking timeline" description="Order received through to proof of delivery.">
        <ActivityTimeline events={shipment.timeline} />
      </SectionCard>

      {relatedDeliveries.length > 0 && (
        <SectionCard title="Delivery runs" description="Scheduled delivery attempts for this consignment.">
          <ul className="divide-y">
            {relatedDeliveries.map((delivery) => (
              <li key={delivery.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="font-medium text-sm">{delivery.reference}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(delivery.scheduledDate)} · {delivery.timeWindow} · {delivery.driver}
                  </p>
                </div>
                <StatusBadge status={delivery.status} />
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
