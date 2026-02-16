import { CardSkeleton, KpiSkeletonRow } from "@/components/skeletons";

export default function AppLoading() {
  return (
    <div className="space-y-6">
      <KpiSkeletonRow />
      <div className="grid gap-4 xl:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
