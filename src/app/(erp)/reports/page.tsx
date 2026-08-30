"use client";

import { useState } from "react";

import Link from "next/link";

import { ArrowRight, BarChart3, Download, FileText } from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { dashboardKpis } from "@/data/erp/dashboard";
import { reportCategories, reportDefinitions } from "@/data/erp/reports";
import { formatDate, formatMoney, formatNumber } from "@/lib/erp/format";

export default function ReportCentrePage() {
  const [category, setCategory] = useState<string>("All");
  const visible = category === "All" ? reportDefinitions : reportDefinitions.filter((report) => report.category === category);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Reports"
        description="The NEXORA report centre — financial statements, commercial analysis and operational registers."
        breadcrumbs={[{ label: "Reports", href: "/reports" }, { label: "Report Centre" }]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast.success("Export preview prepared.", {
                description: "Report exports are demonstrated in the interface only — no file is generated.",
              })
            }
          >
            <Download data-icon="inline-start" />
            Export pack
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Reports available" value={formatNumber(reportDefinitions.length)} hint={`${reportCategories.length} categories`} icon={FileText} />
        <KpiCard label="Revenue reported" value={formatMoney(dashboardKpis.revenue)} hint="Year to date" icon={BarChart3} />
        <KpiCard label="Net profit reported" value={formatMoney(dashboardKpis.netProfit)} hint="Year to date" icon={BarChart3} />
        <KpiCard label="Last refresh" value="30 Jun 2026" hint="All report data" icon={FileText} />
      </section>

      <div className="w-full overflow-x-auto">
        <ToggleGroup
          type="single"
          value={category}
          onValueChange={(value) => value && setCategory(value)}
          variant="outline"
          className="w-max"
        >
          <ToggleGroupItem value="All">All</ToggleGroupItem>
          {reportCategories.map((entry) => (
            <ToggleGroupItem key={entry} value={entry}>
              {entry}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((report) => (
          <Card key={report.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">{report.name}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={report.category} tone="info" />
                <StatusBadge status={report.type} tone="neutral" />
              </div>
              <p className="text-muted-foreground text-xs">
                Owned by {report.owner} · updated {formatDate(report.lastUpdated)}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link prefetch={false} href={report.href}>
                    Open
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.success("Export preview prepared.", {
                      description: `${report.name} was prepared for demonstration only.`,
                    })
                  }
                >
                  <Download data-icon="inline-start" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <SectionCard title="Financial statements" description="Formal statutory statements prepared from the demonstration ledger.">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { href: "/reports/profit-loss", label: "Profit & Loss Statement" },
            { href: "/reports/balance-sheet", label: "Balance Sheet" },
            { href: "/reports/cash-flow", label: "Cash Flow Statement" },
          ].map((entry) => (
            <Button key={entry.href} asChild variant="outline" className="justify-between">
              <Link prefetch={false} href={entry.href}>
                {entry.label}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
