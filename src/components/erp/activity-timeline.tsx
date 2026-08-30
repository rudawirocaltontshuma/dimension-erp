import { formatDateTime } from "@/lib/erp/format";
import { cn } from "@/lib/utils";
import type { StatusTone, TimelineEvent } from "@/types/erp";

const DOT_CLASSES: Record<StatusTone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
  neutral: "bg-muted-foreground",
};

export function ActivityTimeline({ events }: { readonly events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <p className="text-muted-foreground text-sm">No activity has been recorded for this record yet.</p>;
  }

  return (
    <ol className="relative space-y-5 border-border border-l pl-5">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span
            aria-hidden
            className={cn(
              "absolute top-1 -left-[1.6rem] size-2.5 rounded-full ring-4 ring-background",
              DOT_CLASSES[event.tone],
            )}
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <p className="font-medium text-sm">{event.title}</p>
              <span className="text-muted-foreground text-xs">{formatDateTime(event.timestamp)}</span>
            </div>
            <p className="text-muted-foreground text-sm">{event.description}</p>
            <p className="text-muted-foreground text-xs">{event.actor}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
