import { Banknote, Users, Wallet } from "lucide-react";

import { ChartCard, ErpBarChart } from "@/components/erp/charts";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { departments, employees, hrSummary, payrollRuns, payrollTrend } from "@/data/erp/hr";
import { formatDate, formatMoney, formatNumber } from "@/lib/erp/format";

export default function PayrollPage() {
  const latest = payrollRuns.find((run) => run.status === "Processed") ?? payrollRuns[0];
  const departmentPayroll = departments.map((department) => ({
    department: department.name,
    payroll: employees
      .filter((employee) => employee.department === department.name)
      .reduce((sum, employee) => sum + employee.salary, 0),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll Overview"
        description="Monthly payroll position by run and department. Figures are illustrative and are not calculated from live data."
        breadcrumbs={[{ label: "Human Resources", href: "/hr" }, { label: "Payroll" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Gross payroll" value={formatMoney(latest.grossPay)} hint={`${latest.period} run`} icon={Banknote} />
        <KpiCard label="Net payroll" value={formatMoney(latest.netPay)} hint="After statutory deductions" icon={Wallet} />
        <KpiCard label="Employees paid" value={formatNumber(latest.employees)} hint="Included in the latest run" icon={Users} />
        <KpiCard label="Average salary" value={formatMoney(hrSummary.averageSalary)} hint="Monthly cost to company" icon={Banknote} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Payroll trend" description="Gross and net payroll by month.">
          <ErpBarChart
            data={payrollTrend}
            xKey="period"
            money
            series={[
              { key: "gross", label: "Gross" },
              { key: "net", label: "Net" },
            ]}
            height={260}
          />
        </ChartCard>
        <ChartCard title="Payroll by department" description="Monthly payroll cost per department.">
          <ErpBarChart data={departmentPayroll} xKey="department" money series={[{ key: "payroll", label: "Payroll" }]} height={260} />
        </ChartCard>
      </div>

      <SectionCard title="Payroll runs" description="Historic and scheduled payroll runs.">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Employees</TableHead>
                <TableHead className="text-right">Gross pay</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net pay</TableHead>
                <TableHead>Pay date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-medium">{run.period}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(run.employees)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(run.grossPay)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(run.deductions)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(run.netPay)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(run.payDate)}</TableCell>
                  <TableCell>
                    <StatusBadge status={run.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <p className="text-muted-foreground text-xs">
        Payroll figures are fictional demonstration values. No payroll calculation, statutory submission or payment
        processing takes place in this frontend demonstration.
      </p>
    </div>
  );
}
