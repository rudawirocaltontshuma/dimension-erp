import { toneForStatus } from "@/lib/erp/status";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types/erp";

const TONE_CLASSES: Record<StatusTone, string> = {
  success:
    "border-emerald-600/25 bg-emerald-500/12 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/15 dark:text-emerald-300",
  warning:
    "border-amber-600/25 bg-amber-500/12 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/15 dark:text-amber-300",
  danger: "border-red-600/25 bg-red-500/12 text-red-700 dark:border-red-400/25 dark:bg-red-400/15 dark:text-red-300",
  info: "border-sky-600/25 bg-sky-500/12 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/15 dark:text-sky-300",
  neutral: "border-border bg-muted text-muted-foreground",
};

interface StatusBadgeProps {
  readonly status: string;
  readonly tone?: StatusTone;
  readonly className?: string;
}

export function StatusBadge({ status, tone, className }: StatusBadgeProps) {
  const resolved = tone ?? toneForStatus(status);

  return (
    <span
      data-tone={resolved}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 font-medium text-xs",
        TONE_CLASSES[resolved],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function ToneDot({ tone }: { readonly tone: StatusTone }) {
  return <span aria-hidden className={cn("size-2 rounded-full", TONE_CLASSES[tone], "border")} />;
}
