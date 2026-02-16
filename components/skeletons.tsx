import { Skeleton } from "@/components/ui/skeleton";

export function KpiSkeletonRow() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl border border-border p-4">
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-2 rounded-xl border border-border p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border p-4">
      <Skeleton className="mb-3 h-5 w-40" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
