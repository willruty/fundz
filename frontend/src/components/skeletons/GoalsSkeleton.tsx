import { Skeleton } from "../ui/Skeleton";

function FeaturedGoalSkeleton() {
  return (
    <div className="lg:col-span-2 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] p-6 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-36 opacity-40" />
        <Skeleton className="h-6 w-20 rounded-full opacity-40" />
      </div>
      {/* Ring + info */}
      <div className="flex items-center gap-6 flex-grow">
        <Skeleton className="w-[110px] h-[110px] rounded-full shrink-0 opacity-40" />
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-2.5 w-24 opacity-40" />
          <Skeleton className="h-7 w-40 opacity-40" />
          <Skeleton className="h-5 w-32 rounded-md opacity-40" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-auto">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col p-4 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] gap-2">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-7 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TotalGoalsSkeleton() {
  return (
    <div className="lg:col-span-1 flex flex-col p-6 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] gap-4">
      <Skeleton className="h-3 w-24 opacity-30" />
      <div className="flex-grow flex flex-col justify-center gap-2">
        <Skeleton className="h-2.5 w-24 opacity-30" />
        <Skeleton className="h-12 w-36 opacity-30" />
      </div>
      <div className="pt-4 border-t-2 border-white/20 border-dashed flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-2.5 w-24 opacity-30" />
          <Skeleton className="h-7 w-24 rounded-md opacity-30" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-2.5 w-20 opacity-30" />
          <Skeleton className="h-3 w-20 opacity-30" />
        </div>
      </div>
    </div>
  );
}

function OverallProgressSkeleton() {
  return (
    <div className="lg:col-span-1 flex flex-col p-6 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] gap-4">
      <Skeleton className="h-3 w-28" />
      <div className="flex-grow flex items-center">
        <Skeleton className="h-16 w-28" />
      </div>
      <div className="pt-4 border-t-2 border-[var(--black)] border-dashed">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4 mt-2" />
      </div>
    </div>
  );
}

function ChartCardSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden flex flex-col">
      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-20 opacity-30" />
          <Skeleton className="h-6 w-40 opacity-30" />
        </div>
        <Skeleton className="h-3 w-36 opacity-30 mt-2" />
      </div>
      <div className="h-[280px] p-5 pt-7 flex items-end gap-4">
        {[46, 60, 40, 22].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end gap-1">
            <Skeleton className="w-full rounded-sm" style={{ height: `${h * 2.4}px` }} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-5 px-5 pb-4 pt-3 border-t-2 border-[var(--black)] border-dashed">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-3.5 h-3.5" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-5 py-3 flex justify-between items-center">
        <Skeleton className="h-5 w-20 rounded opacity-30" />
        <Skeleton className="h-5 w-16 rounded opacity-30" />
      </div>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-2.5 w-8" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
        <div className="pt-2 border-t-2 border-[var(--black)] border-dashed flex justify-between">
          <Skeleton className="h-5 w-10 rounded" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export function GoalsSkeleton() {
  return (
    <main className="min-h-screen mx-auto space-y-8">
      {/* Section 1: top cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        <FeaturedGoalSkeleton />
        <TotalGoalsSkeleton />
        <OverallProgressSkeleton />
      </section>

      {/* Section 2: charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </section>

      {/* Section 3: goal cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <GoalCardSkeleton key={i} />
        ))}
      </section>
    </main>
  );
}
