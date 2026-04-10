import { Skeleton } from "../ui/Skeleton";

function CommitmentSkeleton() {
  return (
    <div className="lg:col-span-2 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] p-6 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40 opacity-40" />
        <Skeleton className="h-8 w-8 rounded-xl opacity-40" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-2.5 w-28 opacity-40" />
        <Skeleton className="h-12 w-44 opacity-40" />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="flex flex-col p-4 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] gap-2">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="flex flex-col p-4 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] gap-2">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
      </div>
    </div>
  );
}

function StatCardDark() {
  return (
    <div className="lg:col-span-1 flex flex-col p-6 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] gap-4">
      <Skeleton className="h-3 w-28 opacity-30" />
      <div className="flex-grow flex flex-col justify-center gap-2">
        <Skeleton className="h-2.5 w-20 opacity-30" />
        <Skeleton className="h-12 w-32 opacity-30" />
      </div>
      <div className="pt-4 border-t-2 border-white/20 border-dashed flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-2.5 w-20 opacity-30" />
          <Skeleton className="h-6 w-20 rounded-md opacity-30" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-2.5 w-20 opacity-30" />
          <Skeleton className="h-3 w-16 opacity-30" />
        </div>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-20 opacity-30" />
          <Skeleton className="h-6 w-48 opacity-30" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-lg opacity-30" />
          ))}
        </div>
      </div>
      <div className="p-6 flex items-end gap-3 h-56">
        {[45, 60, 80, 55, 70, 90, 65, 75, 50, 85, 60, 70].map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="px-6 pb-4 pt-3 border-t-2 border-[var(--black)] border-dashed flex justify-center gap-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
      <div className="p-5 border-b-2 border-[var(--black)] flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-28" />
          <Skeleton className="h-7 w-44" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-[var(--black)] bg-[var(--main-bg)]">
            {[180, 100, 80, 100, 70].map((w, i) => (
              <th key={i} className="p-4 text-left">
                <Skeleton className="h-3" style={{ width: w }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-b-2 border-[var(--black)]">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </td>
              <td className="p-4"><Skeleton className="h-4 w-20" /></td>
              <td className="p-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
              <td className="p-4"><Skeleton className="h-3 w-20" /></td>
              <td className="p-4"><Skeleton className="h-6 w-14 rounded-md" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SubscriptionsSkeleton() {
  return (
    <main className="min-h-screen mx-auto space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        <CommitmentSkeleton />
        <StatCardDark />
        <StatCardDark />
      </section>
      <ChartSkeleton />
      <TableSkeleton />
    </main>
  );
}
