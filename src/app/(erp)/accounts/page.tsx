import { Landmark } from "lucide-react";

import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { accounts } from "@/data/erp/finance";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { AccountType } from "@/types/erp";
import { cn } from "@/lib/utils";

const GROUPS: AccountType[] = ["Asset", "Liability", "Equity", "Revenue", "Expense"];

export default function AccountsPage() {
  const totalFor = (type: AccountType) =>
    accounts.filter((account) => account.type === type && account.subType !== "Header").reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chart of Accounts"
        description="The general ledger structure covering assets, liabilities, equity, revenue and expenses."
        breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Accounts" }]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {GROUPS.map((group) => (
          <KpiCard key={group} label={`${group}s`} value={formatMoney(totalFor(group))} hint={`${accounts.filter((account) => account.type === group).length} accounts`} icon={Landmark} />
        ))}
      </section>

      {GROUPS.map((group) => {
        const rows = accounts.filter((account) => account.type === group);
        return (
          <SectionCard
            key={group}
            title={`${group} accounts`}
            description={`${formatNumber(rows.length)} ledger accounts in the ${group.toLowerCase()} class.`}
          >
            <div className="w-full overflow-x-auto rounded-md border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Account name</TableHead>
                    <TableHead>Classification</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((account) => {
                    const isHeader = account.subType === "Header";
                    return (
                      <TableRow key={account.id} className={cn(isHeader && "bg-muted/40")}>
                        <TableCell className={cn("font-mono text-xs", isHeader && "font-semibold")}>{account.code}</TableCell>
                        <TableCell className={cn(isHeader ? "font-semibold" : "pl-8")}>{account.name}</TableCell>
                        <TableCell className="text-muted-foreground">{account.subType}</TableCell>
                        <TableCell>
                          <StatusBadge status={account.status} />
                        </TableCell>
                        <TableCell className={cn("text-right tabular-nums", isHeader && "font-semibold")}>
                          {formatMoney(account.balance, account.currency)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
}
