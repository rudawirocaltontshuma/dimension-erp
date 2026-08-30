import { ChartCard, ErpBarChart, ErpLineChart, ErpPieChart } from "@/components/erp/charts";
import { DemoActionButton, PrintButton } from "@/components/erp/demo-actions";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  attendanceRecords,
  departments,
  employeeGrowth,
  employees,
  hrSummary,
  leaveRequests,
  payrollTrend,
} from "@/data/erp/hr";
import { formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export default function HrReportsPage() {
  const attendanceSplit = (["Present", "Remote", "Late", "Absent"] as const).map((status) => ({
    name: status,
    value: attendanceRecords.filter((record) => record.status === status).length,
  }));

  const leaveSplit = (["Annual", "Sick", "Personal", "Family Responsibility", "Study"] as const).map((type) => ({
    type,
    days: leaveRequests.filter((request) => request.leaveType === type).reduce((sum, request) => sum + request.days, 0),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="HR Reports"
        description="Workforce composition, attendance, leave utilisation and payroll trend analysis."
        breadcrumbs={[{ label: "Reports", href: "/reports" }, { label: "Human Resources" }]}
        actions={
          <>
            <PrintButton label="Print report" />
            <DemoActionButton
              size="sm"
              message="Export prepared for demonstration."
              description="A workforce report preview was generated."
            >
              Export report
            </DemoActionButton>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total employees" value={formatNumber(hrSummary.totalEmployees)} change={3.4} />
        <KpiCard label="Attendance rate" value={formatPercent(hrSummary.attendanceRate)} change={0.8} />
        <KpiCard label="Open positions" value={formatNumber(hrSummary.openPositions)} hint="Across all departments" />
        <KpiCard label="Average salary" value={formatMoney(hrSummary.averageSalary)} hint="Monthly, all bands" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Headcount growth" description="Employees on the payroll by month." className="lg:col-span-2">
          <ErpLineChart data={employeeGrowth} xKey="month" series={[{ key: "employees", label: "Employees" }]} />
        </ChartCard>
        <ChartCard title="Attendance mix" description="Attendance status distribution.">
          <ErpPieChart data={attendanceSplit} />
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Payroll trend" description="Gross and net payroll by month.">
          <ErpBarChart
            data={payrollTrend}
            xKey="period"
            money
            series={[
              { key: "gross", label: "Gross pay" },
              { key: "net", label: "Net pay" },
            ]}
            height={260}
          />
        </ChartCard>
        <ChartCard title="Leave utilisation" description="Days taken by leave type.">
          <ErpBarChart data={leaveSplit} xKey="type" series={[{ key: "days", label: "Days" }]} height={260} />
        </ChartCard>
      </section>

      <SectionCard title="Department summary" description="Headcount, budget and performance by department.">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead className="text-right">Headcount</TableHead>
                <TableHead className="text-right">Open roles</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell className="text-muted-foreground">{department.manager}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(department.headcount)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(department.openPositions)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(department.annualBudget)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(department.spentToDate)}</TableCell>
                  <TableCell className="text-right tabular-nums">{department.performanceScore}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Employment status" description="Distribution of the employee master by status.">
        <div className="grid gap-4 sm:grid-cols-3">
          {(["Active", "On Leave", "Inactive"] as const).map((status) => (
            <div key={status} className="rounded-lg border p-4">
              <StatusBadge status={status} />
              <p className="mt-2 font-semibold text-xl tabular-nums">
                {formatNumber(employees.filter((employee) => employee.status === status).length)}
              </p>
              <p className="text-muted-foreground text-xs">employees on the demonstration master</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
