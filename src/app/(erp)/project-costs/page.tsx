"use client";

import { Coins, FileCheck, Receipt } from "lucide-react";

import { ChartCard, ErpBarChart } from "@/components/erp/charts";
import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { projectCosts } from "@/data/erp/projects";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { ProjectCost } from "@/types/erp";

const specs: ColumnSpec<ProjectCost>[] = [
  { id: "reference", header: "Reference", kind: "strong", value: (row) => row.reference },
  {
    id: "project",
    header: "Project",
    kind: "link",
    value: (row) => row.projectName,
    href: (row) => `/projects/${row.projectId}`,
  },
  { id: "date", header: "Date", kind: "date", value: (row) => row.date },
  { id: "category", header: "Category", kind: "muted", value: (row) => row.category },
  { id: "description", header: "Description", value: (row) => row.description },
  {
    id: "amount",
    header: "Amount",
    kind: "money",
    align: "right",
    value: (row) => row.amount,
    currency: (row) => row.currency,
  },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function ProjectCostsPage() {
  const total = projectCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const approved = projectCosts.filter((cost) => cost.status === "Approved");
  const invoiced = projectCosts.filter((cost) => cost.status === "Invoiced");

  const byCategory = Array.from(
    projectCosts.reduce((map, cost) => {
      map.set(cost.category, (map.get(cost.category) ?? 0) + cost.amount);
      return map;
    }, new Map<string, number>()),
  ).map(([category, amount]) => ({ category, amount: Math.round(amount) }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Costs"
        description="Labour, materials, subcontractor, travel, equipment and software costs recorded against projects."
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Project Costs" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Cost entries"
          value={formatNumber(projectCosts.length)}
          hint="Across the portfolio"
          icon={Receipt}
        />
        <KpiCard label="Recorded value" value={formatMoney(total)} hint="All cost categories" icon={Coins} />
        <KpiCard
          label="Approved"
          value={formatMoney(approved.reduce((sum, cost) => sum + cost.amount, 0))}
          hint={`${approved.length} entries`}
          icon={FileCheck}
        />
        <KpiCard
          label="Invoiced to client"
          value={formatMoney(invoiced.reduce((sum, cost) => sum + cost.amount, 0))}
          hint={`${invoiced.length} entries`}
          icon={Receipt}
        />
      </section>

      <ChartCard title="Costs by category" description="Recorded project costs grouped by cost type.">
        <ErpBarChart data={byCategory} xKey="category" money series={[{ key: "amount", label: "Cost" }]} height={250} />
      </ChartCard>

      <SectionCard title="Cost register">
        <DataTable
          data={projectCosts}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.reference} ${row.projectName} ${row.category} ${row.description}`}
          searchPlaceholder="Search costs or projects"
          pageSize={20}
          filters={[
            {
              id: "category",
              label: "Category",
              options: uniqueValues(projectCosts, (row) => row.category),
              getValue: (row) => row.category,
            },
            {
              id: "status",
              label: "Status",
              options: uniqueValues(projectCosts, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "project",
              label: "Project",
              options: uniqueValues(projectCosts, (row) => row.projectName),
              getValue: (row) => row.projectName,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
