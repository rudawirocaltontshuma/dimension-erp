"use client";

import { AlertTriangle, CheckCircle2, Plus, Rocket, Wallet } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { departments } from "@/data/erp/hr";
import { projects, projectSummary } from "@/data/erp/projects";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { Project } from "@/types/erp";

const specs: ColumnSpec<Project>[] = [
  { id: "code", header: "Project", kind: "link", value: (row) => row.code, href: (row) => `/projects/${row.id}` },
  { id: "name", header: "Name", kind: "strong", value: (row) => row.name },
  { id: "client", header: "Client", kind: "muted", value: (row) => row.client },
  { id: "manager", header: "Manager", kind: "muted", value: (row) => row.manager },
  { id: "start", header: "Start", kind: "date", value: (row) => row.startDate },
  { id: "deadline", header: "Deadline", kind: "date", value: (row) => row.deadline },
  { id: "budget", header: "Budget", kind: "money", align: "right", value: (row) => row.budget },
  { id: "spent", header: "Spent", kind: "money", align: "right", value: (row) => row.spent },
  { id: "progress", header: "Progress", kind: "percent", align: "right", value: (row) => row.progress },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Internal and client delivery projects with budget, progress and risk position."
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Projects" }]}
        actions={
          <DemoFormDialog
            title="New project"
            description="Register a demonstration delivery project."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New project
              </Button>
            }
            fields={[
              { name: "name", label: "Project name", required: true },
              { name: "client", label: "Client", required: true },
              { name: "manager", label: "Project manager", required: true },
              { name: "department", label: "Owning department", type: "select", options: departments.map((department) => department.name) },
              { name: "start", label: "Start date", type: "date", required: true },
              { name: "deadline", label: "Deadline", type: "date", required: true },
              { name: "budget", label: "Budget (ZAR)", type: "number", required: true },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active projects" value={formatNumber(projectSummary.active)} hint={`${projectSummary.total} in the portfolio`} icon={Rocket} />
        <KpiCard label="At risk" value={formatNumber(projectSummary.atRisk)} hint="Requires intervention" icon={AlertTriangle} />
        <KpiCard label="Portfolio budget" value={formatMoney(projectSummary.budget)} hint={`${formatMoney(projectSummary.spent)} spent`} icon={Wallet} />
        <KpiCard label="Completed" value={formatNumber(projectSummary.completed)} hint={`${projectSummary.teamMembers} people assigned`} icon={CheckCircle2} />
      </section>

      <SectionCard title="Project register" description="Select a row to open the project workspace.">
        <DataTable
          data={projects}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.code} ${row.name} ${row.client} ${row.manager}`}
          searchPlaceholder="Search projects, clients or managers"
          rowHref={(row) => `/projects/${row.id}`}
          filters={[
            { id: "status", label: "Status", options: uniqueValues(projects, (row) => row.status), getValue: (row) => row.status },
            { id: "department", label: "Department", options: uniqueValues(projects, (row) => row.department), getValue: (row) => row.department },
            { id: "manager", label: "Manager", options: uniqueValues(projects, (row) => row.manager), getValue: (row) => row.manager },
          ]}
        />
      </SectionCard>
    </div>
  );
}
