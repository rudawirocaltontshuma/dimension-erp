import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import { ChartCard, ErpBarChart, ProgressMeter } from "@/components/erp/charts";
import { DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { AvatarGroup, InfoGrid, SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectCosts, projects, projectTasks } from "@/data/erp/projects";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

const TABS = ["Overview", "Tasks", "Team", "Timeline", "Budget", "Costs", "Activity"];

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((entry) => entry.id === id);
  if (!project) notFound();

  const tasks = projectTasks.filter((task) => task.projectId === project.id);
  const costs = projectCosts.filter((cost) => cost.projectId === project.id);
  const costByCategory = Array.from(
    costs.reduce((map, cost) => {
      map.set(cost.category, (map.get(cost.category) ?? 0) + cost.amount);
      return map;
    }, new Map<string, number>()),
  ).map(([category, amount]) => ({ category, amount: Math.round(amount) }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        description={`${project.code} · ${project.client} · managed by ${project.manager}`}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Projects", href: "/projects" },
          { label: project.code },
        ]}
        meta={
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={project.status} />
            <span className="text-muted-foreground text-xs">
              {formatDate(project.startDate)} — {formatDate(project.deadline)}
            </span>
          </div>
        }
        actions={
          <>
            <PrintButton label="Print report" />
            <DemoActionButton
              size="sm"
              message="Demo changes applied."
              description="A project status update was recorded for demonstration."
            >
              Update status
            </DemoActionButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Progress"
          value={formatPercent(project.progress, 0)}
          hint={`${tasks.filter((task) => task.status === "Done").length} of ${tasks.length} tasks complete`}
        />
        <KpiCard label="Budget" value={formatMoney(project.budget, project.currency)} hint="Approved allocation" />
        <KpiCard
          label="Spent"
          value={formatMoney(project.spent, project.currency)}
          hint={formatPercent((project.spent / project.budget) * 100)}
        />
        <KpiCard
          label="Remaining"
          value={formatMoney(project.budget - project.spent, project.currency)}
          hint={`Deadline ${formatDate(project.deadline)}`}
        />
      </section>

      <Tabs defaultValue="Overview" className="space-y-4">
        <div className="w-full overflow-x-auto">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="Overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard title="Project details" className="lg:col-span-2">
              <InfoGrid
                columns={3}
                items={[
                  { label: "Project code", value: project.code },
                  { label: "Client", value: project.client },
                  { label: "Manager", value: project.manager },
                  { label: "Department", value: project.department },
                  { label: "Start date", value: formatDate(project.startDate) },
                  { label: "Deadline", value: formatDate(project.deadline) },
                  { label: "Budget", value: formatMoney(project.budget, project.currency) },
                  { label: "Spent to date", value: formatMoney(project.spent, project.currency) },
                  { label: "Team size", value: formatNumber(project.team.length) },
                ]}
              />
              <p className="mt-4 text-muted-foreground text-sm">{project.description}</p>
            </SectionCard>
            <SectionCard title="Delivery health">
              <div className="space-y-4">
                <ProgressMeter label="Progress" value={project.progress} max={100} />
                <ProgressMeter
                  label="Budget consumed"
                  value={project.spent}
                  max={project.budget}
                  hint={formatPercent((project.spent / project.budget) * 100)}
                />
                <div className="space-y-1">
                  <StatRow
                    label="Open tasks"
                    value={formatNumber(tasks.filter((task) => task.status !== "Done").length)}
                  />
                  <StatRow
                    label="Milestones complete"
                    value={formatNumber(
                      project.milestones.filter((milestone) => milestone.status === "Complete").length,
                    )}
                  />
                  <StatRow
                    label="Recorded costs"
                    value={formatMoney(costs.reduce((sum, cost) => sum + cost.amount, 0))}
                  />
                </div>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="Tasks">
          <SectionCard title="Tasks" description={`${tasks.length} tasks assigned to this project.`}>
            <div className="w-full overflow-x-auto rounded-md border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.reference}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell className="text-muted-foreground">{task.assignee}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(task.dueDate)}</TableCell>
                      <TableCell>
                        <StatusBadge status={task.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={task.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Team">
          <SectionCard title="Project team" description="People assigned to this delivery.">
            <div className="space-y-4">
              <AvatarGroup names={project.team} max={8} />
              <ul className="divide-y">
                {project.team.map((member) => (
                  <li key={member} className="flex items-center justify-between gap-3 py-2.5">
                    <p className="font-medium text-sm">{member}</p>
                    <span className="text-muted-foreground text-xs">
                      {member === project.manager ? "Project manager" : "Team member"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Timeline">
          <SectionCard title="Milestones" description="Delivery milestones for this project.">
            <ul className="space-y-3">
              {project.milestones.map((milestone) => (
                <li
                  key={milestone.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium text-sm">{milestone.name}</p>
                    <p className="text-muted-foreground text-xs">Due {formatDate(milestone.dueDate)}</p>
                  </div>
                  <StatusBadge status={milestone.status} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Budget" className="space-y-4">
          <ChartCard title="Cost by category" description="Recorded costs grouped by cost type.">
            <ErpBarChart
              data={costByCategory}
              xKey="category"
              money
              series={[{ key: "amount", label: "Cost" }]}
              height={250}
            />
          </ChartCard>
          <SectionCard title="Budget position">
            <div className="space-y-1">
              <StatRow label="Approved budget" value={formatMoney(project.budget, project.currency)} />
              <StatRow label="Spent to date" value={formatMoney(project.spent, project.currency)} />
              <StatRow label="Remaining" value={formatMoney(project.budget - project.spent, project.currency)} />
              <StatRow label="Recorded cost entries" value={formatNumber(costs.length)} />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Costs">
          <SectionCard title="Cost register" description="Costs recorded against this project.">
            <div className="w-full overflow-x-auto rounded-md border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costs.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell className="font-medium">{cost.reference}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(cost.date)}</TableCell>
                      <TableCell>{cost.category}</TableCell>
                      <TableCell className="text-muted-foreground">{cost.description}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(cost.amount, cost.currency)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={cost.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Activity">
          <SectionCard title="Project activity">
            <ActivityTimeline
              events={[
                {
                  id: `${project.id}-p1`,
                  title: "Status updated",
                  description: `Project recorded as ${project.status.toLowerCase()} with ${project.progress}% progress.`,
                  timestamp: "2026-06-24T09:00:00.000Z",
                  actor: project.manager,
                  tone: project.status === "At Risk" ? "danger" : "info",
                },
                {
                  id: `${project.id}-p2`,
                  title: "Costs captured",
                  description: `${formatMoney(costs.reduce((sum, cost) => sum + cost.amount, 0))} recorded across ${costs.length} entries.`,
                  timestamp: "2026-06-12T11:20:00.000Z",
                  actor: "Project Office",
                  tone: "neutral",
                },
                {
                  id: `${project.id}-p3`,
                  title: "Project initiated",
                  description: `Kick-off completed on ${formatDate(project.startDate)} with ${project.team.length} team members.`,
                  timestamp: "2026-03-02T08:00:00.000Z",
                  actor: project.manager,
                  tone: "success",
                },
              ]}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
