"use client";

import { Award, CalendarClock, Gauge, Star } from "lucide-react";

import { ChartCard, ErpBarChart } from "@/components/erp/charts";
import { DataTable } from "@/components/erp/data-table";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { departments, performanceReviews } from "@/data/erp/hr";
import { formatNumber } from "@/lib/erp/format";
import type { PerformanceReview } from "@/types/erp";

const specs: ColumnSpec<PerformanceReview>[] = [
  {
    id: "employee",
    header: "Employee",
    kind: "link",
    value: (row) => row.employeeName,
    href: (row) => `/employees/${row.employeeId}`,
  },
  { id: "department", header: "Department", kind: "muted", value: (row) => row.department },
  { id: "period", header: "Review period", value: (row) => row.reviewPeriod },
  { id: "reviewer", header: "Reviewer", kind: "muted", value: (row) => row.reviewer },
  { id: "date", header: "Review date", kind: "date", value: (row) => row.reviewDate },
  { id: "score", header: "Score", kind: "number", align: "right", value: (row) => row.score },
  { id: "rating", header: "Rating", kind: "status", value: (row) => row.rating },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function PerformancePage() {
  const completed = performanceReviews.filter((review) => review.status === "Completed");
  const outstanding = performanceReviews.filter((review) => review.rating === "Outstanding");
  const averageScore = performanceReviews.reduce((sum, review) => sum + review.score, 0) / performanceReviews.length;

  const byDepartment = departments.map((department) => {
    const rows = performanceReviews.filter((review) => review.department === department.name);
    return {
      department: department.name,
      score:
        rows.length === 0
          ? 0
          : Math.round((rows.reduce((sum, review) => sum + review.score, 0) / rows.length) * 10) / 10,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance"
        description="Review cycles, scoring and rating distribution across the workforce."
        breadcrumbs={[{ label: "Human Resources", href: "/hr" }, { label: "Performance" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Reviews"
          value={formatNumber(performanceReviews.length)}
          hint="Current review cycle"
          icon={Gauge}
        />
        <KpiCard
          label="Completed"
          value={formatNumber(completed.length)}
          hint="Signed off by the reviewer"
          icon={Award}
        />
        <KpiCard
          label="Average score"
          value={`${Math.round(averageScore * 10) / 10} / 5.0`}
          hint="All departments"
          icon={Star}
        />
        <KpiCard
          label="Outstanding ratings"
          value={formatNumber(outstanding.length)}
          hint="Top performers"
          icon={CalendarClock}
        />
      </section>

      <ChartCard title="Average score by department" description="Mean performance score per department.">
        <ErpBarChart
          data={byDepartment}
          xKey="department"
          series={[{ key: "score", label: "Average score" }]}
          height={260}
        />
      </ChartCard>

      <SectionCard title="Review register">
        <DataTable
          data={performanceReviews}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.employeeName} ${row.department} ${row.reviewer} ${row.reviewPeriod}`}
          searchPlaceholder="Search reviews or employees"
          filters={[
            {
              id: "status",
              label: "Status",
              options: uniqueValues(performanceReviews, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "rating",
              label: "Rating",
              options: uniqueValues(performanceReviews, (row) => row.rating),
              getValue: (row) => row.rating,
            },
            {
              id: "department",
              label: "Department",
              options: uniqueValues(performanceReviews, (row) => row.department),
              getValue: (row) => row.department,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
