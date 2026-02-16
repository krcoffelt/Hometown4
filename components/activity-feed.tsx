import Link from "next/link";
import { ActivityItem } from "@/lib/types";
import { getRelativeTime } from "@/lib/utils";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <ul className="space-y-3" aria-label="Recent activity">
      {items.slice(0, 8).map((item) => {
        const href = item.entityType === "lead" ? `/leads/${item.entityId}` : item.entityType === "client" ? `/clients/${item.entityId}` : "/tasks";
        return (
          <li key={item.id} className="rounded-lg border border-border/70 bg-background/60 p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm">
                <span className="font-medium">{item.actor}</span> {item.message}
              </p>
              <span className="text-xs text-muted-foreground">{getRelativeTime(item.createdAt)}</span>
            </div>
            <Link className="mt-2 inline-block text-xs font-medium text-primary hover:underline" href={href}>
              Open item
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
