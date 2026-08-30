import Link from "next/link";

import { ArrowRight, BriefcaseBusiness, CalendarCheck, UserPlus, Users } from "lucide-react";

import { ChartCard, ErpBarChart, ErpLineChart, ErpPieChart, ProgressMeter } from "@/components/erp/charts";
import { SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import {
  attendanceRecords,
  departments,
  employeeGrowth,
  employees,
  hrSummary,
  leaveRequests,
  payrollRuns,
  payrollTrend,
} from "@/data/erp/hr";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export default function HrOverviewPage() {
  const attendanceSplit = (["Present", "Remote", "Late", "Absent"] as const).map((status) => ({
    name: status,
    value: attendanceRecords.filter((record) => record.status === status).length,
  }));
  const pendingLeave = leaveRequests.filter((request) => request.status === "Pending").slice(0, 6);
  const latestPayroll = payrollRuns.find((run) => run.status === "Processed") ?? payrollRuns[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Human Resources"
        description="Workforce composition, attendance, leave and payroll position across the group."
        breadcrumbs={[{ label: "Human Resources", href: "/hr" }, { label: "Overview" }]}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link prefetch={false} href="/reports/hr">
              HR reports
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Employees" value={formatNumber(hrSummary.totalEmployees)} change={3.4} icon={Users} />
        <KpiCard label="New hires" value={formatNumber(hrSummary.newHires)} hint="Current quarter" icon={UserPlus} />
        <KpiCard
          label="Open positions"
          value={formatNumber(hrSummary.openPositions)}
          hint="Across all departments"
          icon={BriefcaseBusiness}
        />
        <KpiCard
          label="Leave requests"
          value={formatNumber(hrSummary.pendingLeave)}
          hint="Awaiting approval"
          icon={CalendarCheck}
        />
        <KpiCard
          label="Attendance rate"
          value={formatPercent(hrSummary.attendanceRate)}
          change={0.8}
          icon={CalendarCheck}
        />
        <KpiCard
          label="Monthly payroll"
          value={formatMoney(latestPayroll.grossPay)}
          hint={`${latestPayroll.period} gross`}
          icon={Users}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Employee growth" description="Headcount on the payroll by month." className="lg:col-span-2">
          <ErpLineChart data={employeeGrowth} xKey="month" series={[{ key: "employees", label: "Employees" }]} />
        </ChartCard>
        <ChartCard title="Department distribution" description="Headcount split by department.">
          <ErpPieChart
            data={departments.map((department) => ({ name: department.name, value: department.headcount }))}
          />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Attendance mix" description="Attendance status across recent working days.">
          <ErpPieChart data={attendanceSplit} height={250} />
        </ChartCard>
        <ChartCard title="Payroll trend" description="Gross and net payroll by month.">
          <ErpBarChart
            data={payrollTrend}
            xKey="period"
            money
            series={[
              { key: "gross", label: "Gross" },
              { key: "net", label: "Net" },
            ]}
            height={250}
          />
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Departments"
          description="Budget utilisation per department."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/departments">
                View all
              </Link>
            </Button>
          }
        >
          <div className="space-y-3">
            {departments.map((department) => (
              <ProgressMeter
                key={department.id}
                label={department.name}
                value={department.spentToDate}
                max={department.annualBudget}
                hint={`${formatMoney(department.spentToDate)} of ${formatMoney(department.annualBudget)}`}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Pending leave requests"
          description="Awaiting line manager approval."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/leave">
                Leave register
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {pendingLeave.map((request) => (
              <li key={request.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm">{request.employeeName}</p>
                  <p className="truncate text-muted-foreground text-xs">
                    {request.leaveType} · {formatDate(request.startDate)} — {formatDate(request.endDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">{request.days} d</span>
                  <StatusBadge status={request.status} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Workforce snapshot"
          description="Employment status and tenure summary."
          action={
            <Button asChild variant="outline" size="sm">
              <Link prefetch={false} href="/employees">
                Employees
              </Link>
            </Button>
          }
        >
          <div className="space-y-1">
            <StatRow
              label="Active"
              value={formatNumber(employees.filter((employee) => employee.status === "Active").length)}
            />
            <StatRow
              label="On leave"
              value={formatNumber(employees.filter((employee) => employee.status === "On Leave").length)}
            />
            <StatRow
              label="Inactive"
              value={formatNumber(employees.filter((employee) => employee.status === "Inactive").length)}
            />
            <StatRow
              label="Permanent contracts"
              value={formatNumber(employees.filter((employee) => employee.employmentType === "Permanent").length)}
            />
            <StatRow label="Average salary" value={formatMoney(hrSummary.averageSalary)} />
            <StatRow label="Turnover rate" value={formatPercent(hrSummary.turnoverRate)} />
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
