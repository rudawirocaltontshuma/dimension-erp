import { Building2, Users, Wallet } from "lucide-react";

import { ChartCard, ErpBarChart, ProgressMeter } from "@/components/erp/charts";
import { SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { departments } from "@/data/erp/hr";
import { formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export default function DepartmentsPage() {
  const headcount = departments.reduce((sum, department) => sum + department.headcount, 0);
  const budget = departments.reduce((sum, department) => sum + department.annualBudget, 0);
  const spent = departments.reduce((sum, department) => sum + department.spentToDate, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Departmental headcount, budget utilisation and performance across the group."
        breadcrumbs={[{ label: "Human Resources", href: "/hr" }, { label: "Departments" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Departments"
          value={formatNumber(departments.length)}
          hint="Operating cost centres"
          icon={Building2}
        />
        <KpiCard label="Headcount" value={formatNumber(headcount)} hint="Permanent and contract" icon={Users} />
        <KpiCard label="Annual budget" value={formatMoney(budget)} hint="Combined departmental budget" icon={Wallet} />
        <KpiCard
          label="Budget utilised"
          value={formatPercent((spent / budget) * 100)}
          hint={`${formatMoney(spent)} spent to date`}
          icon={Wallet}
        />
      </section>

      <ChartCard title="Budget against spend" description="Annual budget compared with spend to date.">
        <ErpBarChart
          data={departments.map((department) => ({
            name: department.name,
            budget: department.annualBudget,
            spent: department.spentToDate,
          }))}
          xKey="name"
          money
          series={[
            { key: "budget", label: "Budget" },
            { key: "spent", label: "Spent" },
          ]}
          height={280}
        />
      </ChartCard>

      <section className="grid gap-4 lg:grid-cols-2">
        {departments.map((department) => (
          <SectionCard
            key={department.id}
            title={department.name}
            description={`${department.costCentre} · managed by ${department.manager} · ${department.location}`}
          >
            <div className="space-y-4">
              <ProgressMeter
                label="Budget utilisation"
                value={department.spentToDate}
                max={department.annualBudget}
                hint={`${formatMoney(department.spentToDate)} of ${formatMoney(department.annualBudget)}`}
              />
              <div className="space-y-1">
                <StatRow label="Headcount" value={formatNumber(department.headcount)} />
                <StatRow label="Open positions" value={formatNumber(department.openPositions)} />
                <StatRow label="Performance score" value={`${department.performanceScore} / 5.0`} />
                <StatRow
                  label="Remaining budget"
                  value={formatMoney(department.annualBudget - department.spentToDate)}
                />
              </div>
            </div>
          </SectionCard>
        ))}
      </section>
    </div>
  );
}
