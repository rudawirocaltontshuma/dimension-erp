"use client";

import { CalendarCheck, Clock, Laptop, UserX } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { attendanceRecords } from "@/data/erp/hr";
import { formatNumber, formatPercent } from "@/lib/erp/format";
import type { AttendanceRecord } from "@/types/erp";

const specs: ColumnSpec<AttendanceRecord>[] = [
  { id: "employee", header: "Employee", kind: "link", value: (row) => row.employeeName, href: (row) => `/employees/${row.employeeId}` },
  { id: "department", header: "Department", kind: "muted", value: (row) => row.department },
  { id: "date", header: "Date", kind: "date", value: (row) => row.date },
  { id: "checkIn", header: "Check in", kind: "muted", value: (row) => row.checkIn },
  { id: "checkOut", header: "Check out", kind: "muted", value: (row) => row.checkOut },
  { id: "hours", header: "Hours", kind: "number", align: "right", value: (row) => row.hoursWorked },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function AttendancePage() {
  const present = attendanceRecords.filter((record) => record.status === "Present").length;
  const remote = attendanceRecords.filter((record) => record.status === "Remote").length;
  const late = attendanceRecords.filter((record) => record.status === "Late").length;
  const absent = attendanceRecords.filter((record) => record.status === "Absent").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Daily attendance capture across departments, including remote and late arrivals."
        breadcrumbs={[{ label: "Human Resources", href: "/hr" }, { label: "Attendance" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Present" value={formatNumber(present)} hint={formatPercent((present / attendanceRecords.length) * 100)} icon={CalendarCheck} />
        <KpiCard label="Remote" value={formatNumber(remote)} hint="Working away from site" icon={Laptop} />
        <KpiCard label="Late arrivals" value={formatNumber(late)} hint="After the standard start time" icon={Clock} />
        <KpiCard label="Absent" value={formatNumber(absent)} hint="Unplanned absence" icon={UserX} />
      </section>

      <SectionCard title="Attendance register">
        <DataTable
          data={attendanceRecords}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.employeeName} ${row.department} ${row.status}`}
          searchPlaceholder="Search employees or departments"
          pageSize={20}
          filters={[
            { id: "status", label: "Status", options: uniqueValues(attendanceRecords, (row) => row.status), getValue: (row) => row.status },
            { id: "department", label: "Department", options: uniqueValues(attendanceRecords, (row) => row.department), getValue: (row) => row.department },
            { id: "date", label: "Date", options: uniqueValues(attendanceRecords, (row) => row.date), getValue: (row) => row.date },
          ]}
        />
      </SectionCard>
    </div>
  );
}
