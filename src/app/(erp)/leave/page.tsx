"use client";

import { CalendarDays, CheckCircle2, Clock, Plus } from "lucide-react";

import { ChartCard, ErpBarChart } from "@/components/erp/charts";
import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { employees, leaveRequests } from "@/data/erp/hr";
import { formatNumber } from "@/lib/erp/format";
import type { LeaveRequest } from "@/types/erp";

const specs: ColumnSpec<LeaveRequest>[] = [
  { id: "employee", header: "Employee", kind: "link", value: (row) => row.employeeName, href: (row) => `/employees/${row.employeeId}` },
  { id: "department", header: "Department", kind: "muted", value: (row) => row.department },
  { id: "type", header: "Leave type", value: (row) => row.leaveType },
  { id: "start", header: "From", kind: "date", value: (row) => row.startDate },
  { id: "end", header: "To", kind: "date", value: (row) => row.endDate },
  { id: "days", header: "Days", kind: "number", align: "right", value: (row) => row.days },
  { id: "approver", header: "Approver", kind: "muted", value: (row) => row.approver },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function LeavePage() {
  const approved = leaveRequests.filter((request) => request.status === "Approved");
  const pending = leaveRequests.filter((request) => request.status === "Pending");
  const daysByType = (["Annual", "Sick", "Personal", "Family Responsibility", "Study"] as const).map((type) => ({
    type,
    days: leaveRequests.filter((request) => request.leaveType === type).reduce((sum, request) => sum + request.days, 0),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        description="Annual, sick, personal, family responsibility and study leave across the workforce."
        breadcrumbs={[{ label: "Human Resources", href: "/hr" }, { label: "Leave" }]}
        actions={
          <DemoFormDialog
            title="New leave request"
            description="Capture a demonstration leave request for approval."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New request
              </Button>
            }
            fields={[
              { name: "employee", label: "Employee", type: "select", required: true, options: employees.slice(0, 25).map((employee) => employee.fullName) },
              { name: "type", label: "Leave type", type: "select", required: true, options: ["Annual", "Sick", "Personal", "Family Responsibility", "Study"] },
              { name: "start", label: "Start date", type: "date", required: true },
              { name: "end", label: "End date", type: "date", required: true },
              { name: "reason", label: "Reason", type: "textarea" },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Leave requests" value={formatNumber(leaveRequests.length)} hint="Current leave cycle" icon={CalendarDays} />
        <KpiCard label="Approved" value={formatNumber(approved.length)} hint={`${approved.reduce((sum, request) => sum + request.days, 0)} days approved`} icon={CheckCircle2} />
        <KpiCard label="Pending" value={formatNumber(pending.length)} hint="Awaiting manager approval" icon={Clock} />
        <KpiCard label="Days requested" value={formatNumber(leaveRequests.reduce((sum, request) => sum + request.days, 0))} hint="All leave types" icon={CalendarDays} />
      </section>

      <ChartCard title="Leave by type" description="Days requested per leave category.">
        <ErpBarChart data={daysByType} xKey="type" series={[{ key: "days", label: "Days" }]} height={250} />
      </ChartCard>

      <SectionCard title="Leave register">
        <DataTable
          data={leaveRequests}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.employeeName} ${row.department} ${row.leaveType} ${row.approver}`}
          searchPlaceholder="Search leave requests"
          filters={[
            { id: "status", label: "Status", options: uniqueValues(leaveRequests, (row) => row.status), getValue: (row) => row.status },
            { id: "type", label: "Leave type", options: uniqueValues(leaveRequests, (row) => row.leaveType), getValue: (row) => row.leaveType },
            { id: "department", label: "Department", options: uniqueValues(leaveRequests, (row) => row.department), getValue: (row) => row.department },
          ]}
        />
      </SectionCard>
    </div>
  );
}
