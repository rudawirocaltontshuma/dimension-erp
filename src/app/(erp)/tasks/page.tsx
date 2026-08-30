"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { ClipboardCheck, Columns3, List, Plus } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { projects, projectTasks } from "@/data/erp/projects";
import { formatDate, formatNumber } from "@/lib/erp/format";
import type { ProjectTask, TaskStatus } from "@/types/erp";

const specs: ColumnSpec<ProjectTask>[] = [
  { id: "reference", header: "Task", kind: "strong", value: (row) => row.reference },
  { id: "title", header: "Title", value: (row) => row.title },
  {
    id: "project",
    header: "Project",
    kind: "link",
    value: (row) => row.projectName,
    href: (row) => `/projects/${row.projectId}`,
  },
  { id: "assignee", header: "Assignee", kind: "muted", value: (row) => row.assignee },
  { id: "due", header: "Due", kind: "date", value: (row) => row.dueDate },
  { id: "estimate", header: "Estimate", kind: "number", align: "right", value: (row) => row.estimateHours },
  { id: "logged", header: "Logged", kind: "number", align: "right", value: (row) => row.loggedHours },
  { id: "priority", header: "Priority", kind: "status", value: (row) => row.priority },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

const BOARD_STATUSES: TaskStatus[] = ["Backlog", "Todo", "In Progress", "Review", "Done"];

export default function TasksPage() {
  const [view, setView] = useState<"list" | "board">("list");
  const [projectFilter, setProjectFilter] = useState("All");

  const boardTasks = useMemo(
    () => (projectFilter === "All" ? projectTasks : projectTasks.filter((task) => task.projectName === projectFilter)),
    [projectFilter],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Delivery tasks across the project portfolio in list and board views."
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Tasks" }]}
        actions={
          <DemoFormDialog
            title="New task"
            description="Capture a demonstration project task."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New task
              </Button>
            }
            fields={[
              { name: "title", label: "Task title", required: true },
              {
                name: "project",
                label: "Project",
                type: "select",
                required: true,
                options: projects.map((project) => project.name),
              },
              { name: "assignee", label: "Assignee", required: true },
              { name: "due", label: "Due date", type: "date", required: true },
              { name: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Critical"] },
              { name: "estimate", label: "Estimate (hours)", type: "number" },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Tasks" value={formatNumber(projectTasks.length)} hint="All projects" icon={ClipboardCheck} />
        <KpiCard
          label="In progress"
          value={formatNumber(projectTasks.filter((task) => task.status === "In Progress").length)}
          hint="Actively being delivered"
          icon={ClipboardCheck}
        />
        <KpiCard
          label="In review"
          value={formatNumber(projectTasks.filter((task) => task.status === "Review").length)}
          hint="Awaiting sign-off"
          icon={ClipboardCheck}
        />
        <KpiCard
          label="Completed"
          value={formatNumber(projectTasks.filter((task) => task.status === "Done").length)}
          hint="Closed tasks"
          icon={ClipboardCheck}
        />
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => value && setView(value as "list" | "board")}
          variant="outline"
        >
          <ToggleGroupItem value="list">
            <List className="size-4" />
            List
          </ToggleGroupItem>
          <ToggleGroupItem value="board">
            <Columns3 className="size-4" />
            Board
          </ToggleGroupItem>
        </ToggleGroup>
        {view === "board" && (
          <NativeSelect
            className="w-full sm:w-72"
            aria-label="Filter the board by project"
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
          >
            <option value="All">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </NativeSelect>
        )}
      </div>

      {view === "list" ? (
        <SectionCard title="Task register">
          <DataTable
            data={projectTasks}
            columns={columns}
            columnLabels={columnLabels}
            getRowId={(row) => row.id}
            getSearchText={(row) => `${row.reference} ${row.title} ${row.projectName} ${row.assignee}`}
            searchPlaceholder="Search tasks, projects or assignees"
            pageSize={20}
            filters={[
              {
                id: "status",
                label: "Status",
                options: uniqueValues(projectTasks, (row) => row.status),
                getValue: (row) => row.status,
              },
              {
                id: "priority",
                label: "Priority",
                options: uniqueValues(projectTasks, (row) => row.priority),
                getValue: (row) => row.priority,
              },
              {
                id: "project",
                label: "Project",
                options: uniqueValues(projectTasks, (row) => row.projectName),
                getValue: (row) => row.projectName,
              },
            ]}
          />
        </SectionCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {BOARD_STATUSES.map((status) => {
            const columnTasks = boardTasks.filter((task) => task.status === status);
            return (
              <div key={status} className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm">{status}</p>
                  <span className="rounded-full bg-background px-2 py-0.5 text-muted-foreground text-xs">
                    {columnTasks.length}
                  </span>
                </div>
                <ul className="space-y-2">
                  {columnTasks.map((task) => (
                    <li key={task.id} className="space-y-2 rounded-md border bg-background p-3">
                      <p className="font-medium text-sm">{task.title}</p>
                      <Link
                        prefetch={false}
                        href={`/projects/${task.projectId}`}
                        className="block truncate text-primary text-xs hover:underline"
                      >
                        {task.projectName}
                      </Link>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <StatusBadge status={task.priority} />
                        <span className="text-muted-foreground text-xs">{formatDate(task.dueDate)}</span>
                      </div>
                      <p className="text-muted-foreground text-xs">{task.assignee}</p>
                    </li>
                  ))}
                  {columnTasks.length === 0 && (
                    <li className="rounded-md border border-dashed p-4 text-center text-muted-foreground text-xs">
                      No tasks in this column
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
