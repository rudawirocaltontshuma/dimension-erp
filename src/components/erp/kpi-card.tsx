import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatSignedPercent } from "@/lib/erp/format";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  readonly label: string;
  readonly value: string;
  readonly change?: number;
  readonly changeLabel?: string;
  readonly icon?: LucideIcon;
  readonly hint?: string;
  readonly className?: string;
}

export function KpiCard({ label, value, change, changeLabel, icon: Icon, hint, className }: KpiCardProps) {
  const positive = (change ?? 0) >= 0;

  return (
    <Card className={cn("gap-0 py-4", className)}>
      <CardContent className="space-y-2 px-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-medium text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
          {Icon && <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />}
        </div>
        <p className="truncate font-semibold text-xl tabular-nums md:text-2xl">{value}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {typeof change === "number" && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
              )}
            >
              {positive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
              {formatSignedPercent(change)}
            </span>
          )}
          <span className="text-muted-foreground">{changeLabel ?? hint ?? "vs previous period"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
