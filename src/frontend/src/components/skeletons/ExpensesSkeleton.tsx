import { Skeleton } from "../ui/Skeleton";

function StatCard({ wide }: { wide?: boolean }) {
  return (
    <div
      className={`bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden flex flex-col ${wide ? "col-span-4" : "col-span-2"}`}
    >
      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-5 py-3 flex justify-between items-center">
        <Skeleton className="h-2.5 w-24 opacity-30" />
        <Skeleton className="w-7 h-7 rounded-lg opacity-30" />
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-full" />
        {wide && (
          <div className="flex gap-3 mt-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 flex-1 rounded-lg" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden flex flex-col">
      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-5 py-4 flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-20 opacity-30" />
          <Skeleton className="h-6 w-36 opacity-30" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg opacity-30" />
      </div>
      <div className="p-5 flex items-end gap-1.5 h-64">
        {[55, 70, 45, 85, 60, 75, 50, 90, 65, 80, 40, 70].map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="px-5 pb-4 pt-3 border-t-2 border-[var(--black)] border-dashed flex justify-between">
        <Skeleton className="h-3 w-28" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

function TableCard() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
      <div className="p-5 border-b-2 border-[var(--black)] flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-[var(--black)] bg-[var(--main-bg)]">
            {[160, 80, 80, 90, 80].map((w, i) => (
              <th key={i} className="p-4 text-left">
                <Skeleton className="h-3" style={{ width: w }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 7 }).map((_, i) => (
            <tr key={i} className="border-b-2 border-[var(--black)]">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                </div>
              </td>
              <td className="p-4"><Skeleton className="h-3 w-20" /></td>
              <td className="p-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
              <td className="p-4"><Skeleton className="h-4 w-20" /></td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Skeleton className="w-7 h-7 rounded-md" />
                  <Skeleton className="w-7 h-7 rounded-md" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 border-t-2 border-[var(--black)] flex justify-between items-center">
        <Skeleton className="h-3 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ExpensesSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-10 gap-6">
        {/* Row 1: 4 stat cards */}
        <StatCard />
        <StatCard />
        <StatCard />
        <StatCard wide />

        {/* Row 2: 2 charts */}
        <div className="col-span-5 mt-4"><ChartCard /></div>
        <div className="col-span-5 mt-4"><ChartCard /></div>

        {/* Row 3: table */}
        <div className="col-span-10 mt-4"><TableCard /></div>
      </div>
    </div>
  );
}
