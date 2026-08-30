import Link from "next/link";

import { SectionCard } from "@/components/erp/detail-panels";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { departments } from "@/data/erp/hr";
import { formatMoney, formatNumber } from "@/lib/erp/format";

export default function DepartmentSettingsPage() {
  return (
    <SectionCard
      title="Departments"
      description="Cost centres used for budgeting, requisitions, payroll allocation and reporting."
      action={
        <Button asChild variant="outline" size="sm">
          <Link prefetch={false} href="/departments">
            Department dashboard
          </Link>
        </Button>
      }
    >
      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Cost centre</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Headcount</TableHead>
              <TableHead className="text-right">Annual budget</TableHead>
              <TableHead className="text-right">Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell className="font-mono text-muted-foreground text-xs">{department.costCentre}</TableCell>
                <TableCell>{department.manager}</TableCell>
                <TableCell className="text-muted-foreground">{department.location}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(department.headcount)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatMoney(department.annualBudget)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatMoney(department.spentToDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
