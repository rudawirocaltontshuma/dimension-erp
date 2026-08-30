import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly icon?: LucideIcon;
  readonly action?: ReactNode;
}

export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-14 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon aria-hidden className="size-5" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="mx-auto max-w-md text-muted-foreground text-sm">{description}</p>
      </div>
      {action}
    </div>
  );
}

interface ErrorStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly onRetry?: () => void;
  readonly backHref?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "The requested demonstration data could not be prepared. Try again or return to the previous screen.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle aria-hidden className="size-5" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="mx-auto max-w-md text-muted-foreground text-sm">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function TableSkeleton({ rows = 8, columns = 6 }: { readonly rows?: number; readonly columns?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: rows }, (_, rowIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholder rows
          <div
            key={rowIndex}
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }, (_, columnIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholder cells
              <Skeleton key={columnIndex} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholder cards
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
      <TableSkeleton />
    </div>
  );
}
