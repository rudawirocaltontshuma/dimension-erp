import { ChartCard, ErpBarChart, ErpPieChart } from "@/components/erp/charts";
import { DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  inventoryByCategory,
  inventoryByWarehouse,
  inventoryRecords,
  inventorySummary,
  lowStockItems,
  stockMovements,
} from "@/data/erp/inventory";
import { formatDate, formatMoney, formatNumber } from "@/lib/erp/format";

export default function InventoryReportsPage() {
  const topValueLines = [...inventoryRecords].sort((a, b) => b.stockValue - a.stockValue).slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Reports"
        description="Stock valuation, movement analysis and replenishment exposure across the warehouse network."
        breadcrumbs={[{ label: "Reports", href: "/reports" }, { label: "Inventory" }]}
        actions={
          <>
            <PrintButton label="Print report" />
            <DemoActionButton
              size="sm"
              message="Export prepared for demonstration."
              description="An inventory valuation pack preview was generated."
            >
              Export report
            </DemoActionButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Inventory value" value={formatMoney(inventorySummary.totalValue)} change={-2.8} />
        <KpiCard label="Units on hand" value={formatNumber(inventorySummary.totalUnits)} hint="All warehouses" />
        <KpiCard label="Low stock lines" value={formatNumber(inventorySummary.lowStock)} hint="Below reorder level" />
        <KpiCard label="Stock movements" value={formatNumber(stockMovements.length)} hint="Rolling 120 days" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Value by warehouse" description="Stock valuation per facility." className="lg:col-span-2">
          <ErpBarChart
            data={inventoryByWarehouse}
            xKey="warehouse"
            money
            series={[{ key: "value", label: "Stock value" }]}
          />
        </ChartCard>
        <ChartCard title="Value by category" description="Category concentration of stock value.">
          <ErpPieChart
            data={inventoryByCategory.slice(0, 6).map((entry) => ({ name: entry.category, value: entry.value }))}
          />
        </ChartCard>
      </section>

      <SectionCard title="Highest value stock lines" description="Top ten SKU and warehouse combinations by valuation.">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead className="text-right">On hand</TableHead>
                <TableHead className="text-right">Stock value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topValueLines.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.sku}</TableCell>
                  <TableCell>{record.productName}</TableCell>
                  <TableCell className="text-muted-foreground">{record.warehouseName}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(record.onHand)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(record.stockValue)}</TableCell>
                  <TableCell>
                    <StatusBadge status={record.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Replenishment exposure" description="Lines at or below the reorder level.">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Reorder level</TableHead>
                <TableHead>Last counted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.slice(0, 12).map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.sku}</TableCell>
                  <TableCell>{record.productName}</TableCell>
                  <TableCell className="text-muted-foreground">{record.warehouseName}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(record.available)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(record.reorderLevel)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(record.lastCountedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
