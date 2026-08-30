import Link from "next/link";

import { AlertTriangle, ArrowRight, CheckCircle2, Rocket, Wallet } from "lucide-react";

import { ChartCard, ErpBarChart, ErpPieChart, ProgressMeter } from "@/components/erp/charts";
import { AvatarGroup, SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { projectCosts, projectSummary, projects, projectTasks } from "@/data/erp/projects";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export default function ProjectOverviewPage() {
  const statusSplit = (["Planning", "Active", "At Risk", "Completed", "On Hold"] as const).map((status) => ({
    name: status,
    value: projects.filter((project) => project.status === status).length,
  }));

  const costByCategory = Array.from(
    projectCosts.reduce((map, cost) => {
      map.set(cost.category, (map.get(cost.category) ?? 0) + cost.amount);
      return map;
    }, new Map<string, number>()),
  ).map(([category, amount]) => ({ category, amount: Math.round(amount) }));

  const attention = projects.filter((project) => project.status === "At Risk" || project.spent > project.budget);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Overview"
        description="Portfolio health across budget, delivery progress, cost categories and team allocation."
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Overview" }]}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link prefetch={false} href="/projects">
              Project register
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active projects"
          value={formatNumber(projectSummary.active)}
          hint={`${projectSummary.total} total`}
          icon={Rocket}
        />
        <KpiCard
          label="At risk"
          value={formatNumber(projectSummary.atRisk)}
          hint="Escalated to the steering group"
          icon={AlertTriangle}
        />
        <KpiCard
          label="Budget committed"
          value={formatMoney(projectSummary.budget)}
          hint={`${formatPercent((projectSummary.spent / projectSummary.budget) * 100)} spent`}
          icon={Wallet}
        />
        <KpiCard
          label="Completed"
          value={formatNumber(projectSummary.completed)}
          hint="Closed and handed over"
          icon={CheckCircle2}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Budget against spend"
          description="Top projects by committed budget."
          className="lg:col-span-2"
        >
          <ErpBarChart
            data={projects
              .slice(0, 10)
              .map((project) => ({ name: project.code, budget: project.budget, spent: project.spent }))}
            xKey="name"
            money
            series={[
              { key: "budget", label: "Budget" },
              { key: "spent", label: "Spent" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Portfolio status" description="Projects by delivery status.">
          <ErpPieChart data={statusSplit} />
        </ChartCard>
      </section>

      <ChartCard title="Costs by category" description="Recorded project costs by cost type.">
        <ErpBarChart
          data={costByCategory}
          xKey="category"
          money
          series={[{ key: "amount", label: "Cost" }]}
          height={250}
        />
      </ChartCard>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Projects requiring attention" description="At risk or trending over budget.">
          <ul className="space-y-4">
            {attention.slice(0, 6).map((project) => (
              <li key={project.id} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    prefetch={false}
                    href={`/projects/${project.id}`}
                    className="font-medium text-sm hover:underline"
                  >
                    {project.name}
                  </Link>
                  <StatusBadge status={project.status} />
                </div>
                <ProgressMeter
                  label={`${project.manager} · deadline ${formatDate(project.deadline)}`}
                  value={project.spent}
                  max={project.budget}
                  hint={`${formatMoney(project.spent)} of ${formatMoney(project.budget)}`}
                />
                <AvatarGroup names={project.team} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Delivery summary">
          <div className="space-y-1">
            <StatRow
              label="Projects in planning"
              value={formatNumber(projects.filter((project) => project.status === "Planning").length)}
            />
            <StatRow label="Projects on hold" value={formatNumber(projectSummary.onHold)} />
            <StatRow
              label="Tasks in flight"
              value={formatNumber(projectTasks.filter((task) => task.status === "In Progress").length)}
            />
            <StatRow
              label="Tasks in review"
              value={formatNumber(projectTasks.filter((task) => task.status === "Review").length)}
            />
            <StatRow
              label="Tasks completed"
              value={formatNumber(projectTasks.filter((task) => task.status === "Done").length)}
            />
            <StatRow
              label="Recorded costs"
              value={formatMoney(projectCosts.reduce((sum, cost) => sum + cost.amount, 0))}
            />
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
