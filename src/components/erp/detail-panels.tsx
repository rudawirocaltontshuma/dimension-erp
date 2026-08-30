import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { initialsOf } from "@/lib/erp/format";
import { cn } from "@/lib/utils";

export interface InfoItem {
  label: string;
  value: ReactNode;
}

export function InfoGrid({ items, columns = 2 }: { readonly items: InfoItem[]; readonly columns?: 2 | 3 | 4 }) {
  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0 space-y-1">
          <dt className="text-muted-foreground text-xs uppercase tracking-wide">{item.label}</dt>
          <dd className="break-words font-medium text-sm">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

interface SectionCardProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly contentClassName?: string;
}

export function SectionCard({ title, description, action, children, className, contentClassName }: SectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

export function AvatarGroup({ names, max = 5 }: { readonly names: string[]; readonly max?: number }) {
  const visible = names.slice(0, max);
  const remaining = names.length - visible.length;

  return (
    <div className="flex items-center">
      {visible.map((name, index) => (
        <span
          key={name}
          title={name}
          className={cn(
            "flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted font-medium text-muted-foreground text-xs",
            index > 0 && "-ml-2",
          )}
        >
          {initialsOf(name)}
        </span>
      ))}
      {remaining > 0 && (
        <span className="-ml-2 flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary/10 font-medium text-primary text-xs">
          +{remaining}
        </span>
      )}
    </div>
  );
}

export function StatRow({
  label,
  value,
  hint,
}: {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b py-2 last:border-b-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-right">
        <span className="font-medium text-sm tabular-nums">{value}</span>
        {hint && <span className="block text-muted-foreground text-xs">{hint}</span>}
      </span>
    </div>
  );
}
