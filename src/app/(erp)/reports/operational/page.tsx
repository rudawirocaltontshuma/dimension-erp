import { ChartCard, ErpBarChart, ErpPieChart, ProgressMeter } from "@/components/erp/charts";
import { DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { operationsSnapshot } from "@/data/erp/dashboard";
import { deliveryPerformance, logisticsSummary, shipmentsByRegion, vehicles } from "@/data/erp/logistics";
import { warehouses } from "@/data/erp/organisation";
import { projects, projectSummary } from "@/data/erp/projects";
import { orders } from "@/data/erp/sales";
import { formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export default function OperationalReportsPage() {
  const statusSplit = (["Pending", "Processing", "Completed", "Cancelled"] as const).map((status) => ({
    name: status,
    value: orders.filter((order) => order.status === status).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operational Reports"
        description="Fulfilment, warehouse throughput, delivery performance, fleet utilisation and project delivery."
        breadcrumbs={[{ label: "Reports", href: "/reports" }, { label: "Operational" }]}
        actions={
          <>
            <PrintButton label="Print report" />
            <DemoActionButton size="sm" message="Export prepared for demonstration." description="An operational service pack preview was generated.">
              Export report
            </DemoActionButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Order fulfilment rate" value={formatPercent(operationsSnapshot.fulfilmentRate)} change={1.4} />
        <KpiCard label="On-time delivery" value={formatPercent(logisticsSummary.onTimeRate)} change={2.1} />
        <KpiCard label="Fleet available" value={formatNumber(vehicles.filter((vehicle) => vehicle.status === "Available").length)} hint={`${vehicles.length} vehicles in the fleet`} />
        <KpiCard label="Projects at risk" value={formatNumber(projectSummary.atRisk)} hint={`${projectSummary.active} active projects`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Delivery performance" description="On-time against late deliveries by week." className="lg:col-span-2">
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
        <ChartCard title="Order status" description="Fulfilment pipeline distribution.">
          <ErpPieChart data={statusSplit} />
        </ChartCard>
      </section>

      <ChartCard title="Shipments by region" description="Consignment volume by destination province.">
        <ErpBarChart data={shipmentsByRegion} xKey="region" series={[{ key: "count", label: "Shipments" }]} height={260} />
      </ChartCard>

      <SectionCard title="Warehouse throughput" description="Inbound and outbound activity per facility.">
        <div className="grid gap-4 sm:grid-cols-2">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm">{warehouse.name}</p>
                <StatusBadge status={warehouse.status} />
              </div>
              <ProgressMeter label="Capacity utilisation" value={warehouse.utilization} max={100} />
              <p className="text-muted-foreground text-xs">
                Inbound {formatNumber(warehouse.inboundThisWeek)} · Outbound {formatNumber(warehouse.outboundThisWeek)} ·{" "}
                {formatMoney(warehouse.stockValue)} stock value
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Project portfolio" description="Budget and progress across the active portfolio.">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Progress</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.slice(0, 12).map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="text-muted-foreground">{project.manager}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(project.budget)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(project.spent)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPercent(project.progress, 0)}</TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
