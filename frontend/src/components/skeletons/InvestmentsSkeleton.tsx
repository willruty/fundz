import { Skeleton } from "../ui/Skeleton";

function PortfolioCardSkeleton() {
  return (
    <div className="lg:col-span-2 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] p-6 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32 opacity-40" />
        <Skeleton className="w-9 h-9 rounded-xl opacity-40" />
      </div>
      <div className="flex-grow flex flex-col justify-center gap-2">
        <Skeleton className="h-2.5 w-28 opacity-40" />
        <Skeleton className="h-12 w-44 opacity-40" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col p-3 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] gap-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BestAssetSkeleton() {
  return (
    <div className="lg:col-span-1 flex flex-col p-6 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] gap-4">
      <Skeleton className="h-3 w-24 opacity-30" />
      <div className="flex-grow flex flex-col justify-center gap-2">
        <Skeleton className="h-2.5 w-20 opacity-30" />
        <Skeleton className="h-5 w-28 opacity-30" />
        <Skeleton className="h-11 w-24 opacity-30" />
      </div>
      <div className="pt-4 border-t-2 border-white/20 border-dashed flex justify-between">
        <Skeleton className="h-2.5 w-12 opacity-30" />
        <Skeleton className="h-3 w-20 opacity-30" />
      </div>
    </div>
  );
}

function SimResultSkeleton() {
  return (
    <div className="lg:col-span-1 flex flex-col p-6 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] gap-4">
      <Skeleton className="h-3 w-32" />
      <div className="flex-grow flex flex-col justify-center gap-2">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="h-12 w-36" />
      </div>
      <div className="pt-4 border-t-2 border-[var(--black)] border-dashed flex flex-col gap-2">
        <div className="flex justify-between"><Skeleton className="h-2.5 w-20" /><Skeleton className="h-3 w-20" /></div>
        <div className="flex justify-between"><Skeleton className="h-2.5 w-16" /><Skeleton className="h-3 w-20" /></div>
      </div>
    </div>
  );
}

function CalculatorSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-20 opacity-30" />
          <Skeleton className="h-6 w-40 opacity-30" />
        </div>
        <Skeleton className="w-9 h-9 rounded-xl opacity-30" />
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
        {/* Type selector */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-32" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        </div>
        {/* Period results */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { bg: "bg-white", h: "h-24" },
            { bg: "bg-[var(--secondary)]", h: "h-24" },
            { bg: "bg-[var(--primary)]", h: "h-24" },
            { bg: "bg-[var(--primary)]", h: "h-24" },
          ].map((card, i) => (
            <div key={i} className={`${card.bg} ${card.h} border-2 border-[var(--black)] rounded-[var(--radius-card)] p-4 flex flex-col gap-2`}>
              <Skeleton className={`h-3 w-12 ${card.bg !== "bg-white" ? "opacity-40" : ""}`} />
              <Skeleton className={`h-6 w-20 ${card.bg !== "bg-white" ? "opacity-40" : ""}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GrowthChartSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-20 opacity-30" />
          <Skeleton className="h-6 w-44 opacity-30" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg opacity-30" />
      </div>
      <div className="p-6 h-72 flex items-end gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: `${20 + i * 3.5}%` }}
          />
        ))}
      </div>
      <div className="px-6 pb-4 pt-3 border-t-2 border-[var(--black)] border-dashed flex justify-center gap-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

function PortfolioTableSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-20 opacity-30" />
          <Skeleton className="h-6 w-36 opacity-30" />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl opacity-30" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-[var(--black)] bg-[var(--main-bg)]">
            {[160, 100, 90, 80, 80, 120].map((w, i) => (
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
                  <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                </div>
              </td>
              <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
              <td className="p-4"><Skeleton className="h-4 w-20" /></td>
              <td className="p-4"><Skeleton className="h-4 w-14" /></td>
              <td className="p-4">
                {/* sparkline simulada */}
                <div className="flex items-end gap-0.5 h-6">
                  {[3,5,4,6,5,7,6,8].map((h, j) => (
                    <Skeleton key={j} className="w-1.5 rounded-sm" style={{ height: `${h * 3}px` }} />
                  ))}
                </div>
              </td>
              <td className="p-4"><Skeleton className="h-6 w-16 rounded-md" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InvestmentsSkeleton() {
  return (
    <main className="min-h-screen mx-auto space-y-8">
      {/* Section 1: overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        <PortfolioCardSkeleton />
        <BestAssetSkeleton />
        <SimResultSkeleton />
      </section>

      {/* Section 2: calculator */}
      <CalculatorSkeleton />

      {/* Section 3: growth chart */}
      <GrowthChartSkeleton />

      {/* Section 4: portfolio table */}
      <PortfolioTableSkeleton />
    </main>
  );
}
