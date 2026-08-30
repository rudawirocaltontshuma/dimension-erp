import { notFound } from "next/navigation";

import { FileText } from "lucide-react";

import { ActivityTimeline } from "@/components/erp/activity-timeline";
import { ProgressMeter } from "@/components/erp/charts";
import { DemoActionButton } from "@/components/erp/demo-actions";
import { InfoGrid, SectionCard, StatRow } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { EmptyState } from "@/components/erp/states";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { attendanceRecords, employees, leaveRequests, performanceReviews } from "@/data/erp/hr";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";

export function generateStaticParams() {
  return employees.map((employee) => ({ id: employee.id }));
}

const TABS = ["Overview", "Personal", "Employment", "Attendance", "Leave", "Performance", "Documents", "Activity"];

const DOCUMENTS = [
  { name: "Employment contract", type: "PDF", updated: "2026-02-14" },
  { name: "Identity document copy", type: "PDF", updated: "2026-02-14" },
  { name: "Qualification certificates", type: "PDF", updated: "2026-03-02" },
  { name: "Signed code of conduct", type: "PDF", updated: "2026-03-08" },
  { name: "Latest performance review", type: "PDF", updated: "2026-06-12" },
];

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = employees.find((entry) => entry.id === id);
  if (!employee) notFound();

  const attendance = attendanceRecords.filter((record) => record.employeeId === employee.id);
  const leave = leaveRequests.filter((request) => request.employeeId === employee.id);
  const reviews = performanceReviews.filter((review) => review.employeeId === employee.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={employee.fullName}
        description={`${employee.jobTitle} · ${employee.department} · ${employee.location}`}
        breadcrumbs={[
          { label: "Human Resources", href: "/hr" },
          { label: "Employees", href: "/employees" },
          { label: employee.employeeNumber },
        ]}
        meta={
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={employee.status} />
            <span className="text-muted-foreground text-xs">Employed since {formatDate(employee.hireDate)}</span>
          </div>
        }
        actions={
          <DemoActionButton size="sm" message="Demo changes applied." description="A performance review was scheduled for this employee.">
            Schedule review
          </DemoActionButton>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Attendance rate" value={formatPercent(employee.attendanceRate)} hint="Rolling twelve months" />
        <KpiCard label="Performance score" value={`${employee.performanceScore} / 5.0`} hint="Latest review" />
        <KpiCard label="Leave balance" value={`${employee.leaveBalance} days`} hint="Annual leave available" />
        <KpiCard label="Monthly cost to company" value={formatMoney(employee.salary, employee.currency)} hint={employee.employmentType} />
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
            <SectionCard title="Profile summary" className="lg:col-span-2">
              <InfoGrid
                columns={3}
                items={[
                  { label: "Employee number", value: employee.employeeNumber },
                  { label: "Job title", value: employee.jobTitle },
                  { label: "Department", value: employee.department },
                  { label: "Reports to", value: employee.manager },
                  { label: "Location", value: employee.location },
                  { label: "Employment type", value: employee.employmentType },
                  { label: "Work email", value: employee.email },
                  { label: "Contact number", value: employee.phone },
                  { label: "Start date", value: formatDate(employee.hireDate) },
                ]}
              />
            </SectionCard>
            <SectionCard title="Key measures">
              <div className="space-y-4">
                <ProgressMeter label="Attendance" value={employee.attendanceRate} max={100} />
                <ProgressMeter label="Performance" value={employee.performanceScore} max={5} hint={`${employee.performanceScore} / 5.0`} />
                <div className="space-y-1">
                  <StatRow label="Leave taken" value={`${formatNumber(leave.reduce((sum, request) => sum + request.days, 0))} days`} />
                  <StatRow label="Leave balance" value={`${employee.leaveBalance} days`} />
                  <StatRow label="Reviews completed" value={formatNumber(reviews.length)} />
                </div>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="Personal">
          <SectionCard title="Personal information" description="Held for demonstration purposes only.">
            <InfoGrid
              columns={3}
              items={[
                { label: "Full name", value: employee.fullName },
                { label: "Identity number", value: employee.idNumber },
                { label: "Contact number", value: employee.phone },
                { label: "Email", value: employee.email },
                { label: "Address", value: employee.address.line1 },
                { label: "City", value: `${employee.address.city}, ${employee.address.province}` },
                { label: "Postal code", value: employee.address.postalCode },
                { label: "Country", value: employee.address.country },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="Employment">
          <SectionCard title="Employment details">
            <InfoGrid
              columns={3}
              items={[
                { label: "Employment type", value: employee.employmentType },
                { label: "Status", value: employee.status },
                { label: "Start date", value: formatDate(employee.hireDate) },
                { label: "Department", value: employee.department },
                { label: "Location", value: employee.location },
                { label: "Line manager", value: employee.manager },
                { label: "Cost to company", value: formatMoney(employee.salary, employee.currency) },
                { label: "Currency", value: employee.currency },
                { label: "Employee number", value: employee.employeeNumber },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="Attendance">
          <SectionCard title="Attendance" description="Recent attendance records for this employee.">
            {attendance.length === 0 ? (
              <EmptyState title="No attendance captured" description="Attendance for this employee is not part of the demonstration sample." />
            ) : (
              <div className="w-full overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Check in</TableHead>
                      <TableHead>Check out</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell className="text-muted-foreground">{record.checkIn}</TableCell>
                        <TableCell className="text-muted-foreground">{record.checkOut}</TableCell>
                        <TableCell className="text-right tabular-nums">{record.hoursWorked}</TableCell>
                        <TableCell>
                          <StatusBadge status={record.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="Leave">
          <SectionCard title="Leave history">
            {leave.length === 0 ? (
              <EmptyState title="No leave recorded" description="This employee has no leave requests in the demonstration dataset." />
            ) : (
              <div className="w-full overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead className="text-right">Days</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leave.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.leaveType}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(request.startDate)}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(request.endDate)}</TableCell>
                        <TableCell className="text-right tabular-nums">{request.days}</TableCell>
                        <TableCell>
                          <StatusBadge status={request.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="Performance">
          <SectionCard title="Performance reviews">
            {reviews.length === 0 ? (
              <EmptyState title="No reviews recorded" description="Performance reviews for this employee will appear here." />
            ) : (
              <div className="w-full overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Reviewer</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>{review.reviewPeriod}</TableCell>
                        <TableCell className="text-muted-foreground">{review.reviewer}</TableCell>
                        <TableCell className="text-right tabular-nums">{review.score}</TableCell>
                        <TableCell>
                          <StatusBadge status={review.rating} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={review.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="Documents">
          <SectionCard title="Documents" description="Document register placeholders — no files are stored in this demonstration.">
            <ul className="divide-y">
              {DOCUMENTS.map((document) => (
                <li key={document.name} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <FileText aria-hidden className="size-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{document.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {document.type} · updated {formatDate(document.updated)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status="Available" tone="neutral" />
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="Activity">
          <SectionCard title="Employee activity">
            <ActivityTimeline
              events={[
                {
                  id: `${employee.id}-e1`,
                  title: "Performance review completed",
                  description: `Latest score recorded at ${employee.performanceScore} out of 5.0.`,
                  timestamp: "2026-06-12T10:00:00.000Z",
                  actor: employee.manager,
                  tone: "success",
                },
                {
                  id: `${employee.id}-e2`,
                  title: "Leave balance updated",
                  description: `${employee.leaveBalance} days of annual leave available.`,
                  timestamp: "2026-06-01T08:00:00.000Z",
                  actor: "Payroll Service",
                  tone: "info",
                },
                {
                  id: `${employee.id}-e3`,
                  title: "Employment commenced",
                  description: `Started as ${employee.jobTitle} on ${formatDate(employee.hireDate)}.`,
                  timestamp: "2026-02-14T07:30:00.000Z",
                  actor: "Human Resources",
                  tone: "neutral",
                },
              ]}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
