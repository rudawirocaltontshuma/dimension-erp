"use client";

import { BriefcaseBusiness, CalendarCheck, Plus, Users } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { departments, employees, hrSummary } from "@/data/erp/hr";
import { formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";
import type { Employee } from "@/types/erp";

const specs: ColumnSpec<Employee>[] = [
  {
    id: "number",
    header: "Employee no.",
    kind: "link",
    value: (row) => row.employeeNumber,
    href: (row) => `/employees/${row.id}`,
  },
  { id: "name", header: "Name", kind: "strong", value: (row) => row.fullName },
  { id: "jobTitle", header: "Job title", value: (row) => row.jobTitle },
  { id: "department", header: "Department", kind: "muted", value: (row) => row.department },
  { id: "location", header: "Location", kind: "muted", value: (row) => row.location },
  { id: "manager", header: "Manager", kind: "muted", value: (row) => row.manager },
  { id: "type", header: "Type", kind: "muted", value: (row) => row.employmentType },
  { id: "hireDate", header: "Hired", kind: "date", value: (row) => row.hireDate },
  { id: "attendance", header: "Attendance", kind: "percent", align: "right", value: (row) => row.attendanceRate },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="The employee master across every department, location and employment type."
        breadcrumbs={[{ label: "Human Resources", href: "/hr" }, { label: "Employees" }]}
        actions={
          <DemoFormDialog
            title="New employee"
            description="Capture a demonstration employee record."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New employee
              </Button>
            }
            fields={[
              { name: "firstName", label: "First name", required: true },
              { name: "lastName", label: "Last name", required: true },
              { name: "email", label: "Work email", type: "email", required: true },
              { name: "jobTitle", label: "Job title", required: true },
              {
                name: "department",
                label: "Department",
                type: "select",
                required: true,
                options: departments.map((department) => department.name),
              },
              {
                name: "type",
                label: "Employment type",
                type: "select",
                options: ["Permanent", "Contract", "Part-Time", "Intern"],
              },
              { name: "hireDate", label: "Start date", type: "date", required: true },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Employee records"
          value={formatNumber(employees.length)}
          hint={`${hrSummary.totalEmployees} group-wide`}
          icon={Users}
        />
        <KpiCard
          label="Active"
          value={formatNumber(employees.filter((employee) => employee.status === "Active").length)}
          hint="Currently working"
          icon={BriefcaseBusiness}
        />
        <KpiCard
          label="On leave"
          value={formatNumber(employees.filter((employee) => employee.status === "On Leave").length)}
          hint="Approved absence"
          icon={CalendarCheck}
        />
        <KpiCard
          label="Average salary"
          value={formatMoney(employees.reduce((sum, employee) => sum + employee.salary, 0) / employees.length)}
          hint={`Attendance ${formatPercent(hrSummary.attendanceRate)}`}
          icon={Users}
        />
      </section>

      <SectionCard title="Employee register" description="Select a row to open the employee profile.">
        <DataTable
          data={employees}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) =>
            `${row.employeeNumber} ${row.fullName} ${row.jobTitle} ${row.department} ${row.location}`
          }
          searchPlaceholder="Search employees, roles or departments"
          rowHref={(row) => `/employees/${row.id}`}
          pageSize={20}
          filters={[
            {
              id: "department",
              label: "Department",
              options: uniqueValues(employees, (row) => row.department),
              getValue: (row) => row.department,
            },
            {
              id: "status",
              label: "Status",
              options: uniqueValues(employees, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "location",
              label: "Location",
              options: uniqueValues(employees, (row) => row.location),
              getValue: (row) => row.location,
            },
            {
              id: "type",
              label: "Type",
              options: uniqueValues(employees, (row) => row.employmentType),
              getValue: (row) => row.employmentType,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
