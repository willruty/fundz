import { Skeleton } from "../ui/Skeleton";

const CARD_COLORS = ["#820AD1", "#003399", "#F9D100", "#111111"];

function BankCardSkeleton({ color }: { color: string }) {
  const isLight = color === "#F9D100";
  return (
    <div
      className="relative flex flex-col justify-between p-6 rounded-[var(--radius-card)] border-2 border-[var(--black)] shadow-[var(--neo-shadow)] min-h-[196px] overflow-hidden"
      style={{ background: color }}
    >
      {/* Decoração geométrica */}
      <div
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-2 opacity-10"
        style={{ borderColor: isLight ? "#000" : "#fff" }}
      />
      <div
        className="absolute -bottom-10 -right-4 w-24 h-24 rounded-full border-2 opacity-10"
        style={{ borderColor: isLight ? "#000" : "#fff" }}
      />

      {/* Topo */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <Skeleton
            className="w-10 h-10 rounded-md border-2 opacity-20"
            style={{ borderColor: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)" }}
          />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-20 opacity-20" />
            <Skeleton className="h-3 w-28 opacity-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-24 rounded opacity-20" />
      </div>

      {/* Saldo */}
      <div className="relative z-10 mt-4 flex flex-col gap-1.5">
        <Skeleton className="h-2.5 w-24 opacity-20" />
        <Skeleton className="h-8 w-32 opacity-20" />
      </div>

      {/* Rodapé */}
      <div className="flex justify-between items-end relative z-10 mt-3">
        <Skeleton className="h-3 w-24 opacity-20" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-16 opacity-20" />
          <Skeleton className="h-3 w-16 opacity-20" />
        </div>
      </div>
    </div>
  );
}

function SummaryBarSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { bg: "bg-[var(--secondary)]" },
        { bg: "bg-white" },
        { bg: "bg-white" },
        { bg: "bg-[var(--primary)]" },
      ].map((card, i) => (
        <div
          key={i}
          className={`${card.bg} border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] p-5 flex flex-col gap-2`}
        >
          <Skeleton className={`h-2.5 w-24 ${card.bg === "bg-[var(--primary)]" ? "opacity-30" : ""}`} />
          <Skeleton className={`h-8 w-32 ${card.bg === "bg-[var(--primary)]" ? "opacity-30" : ""}`} />
        </div>
      ))}
    </div>
  );
}

function AnalyticsChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie chart */}
      <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
        <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4">
          <Skeleton className="h-2.5 w-20 opacity-30 mb-1.5" />
          <Skeleton className="h-6 w-40 opacity-30" />
        </div>
        <div className="p-6 flex items-center gap-6">
          <Skeleton className="w-44 h-44 rounded-full shrink-0" />
          <div className="flex flex-col gap-3 flex-1">
            {CARD_COLORS.map((c, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-[var(--black)] shrink-0" style={{ background: c }} />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
        <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-20 opacity-30" />
            <Skeleton className="h-6 w-36 opacity-30" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg opacity-30" />
        </div>
        <div className="p-6 flex items-end gap-3 h-52">
          {[55, 70, 85, 65, 75, 90].map((h, i) => (
            <div key={i} className="flex-1 flex gap-1.5 items-end">
              <Skeleton className="flex-1 rounded-sm" style={{ height: `${h}%` }} />
              <Skeleton className="flex-1 rounded-sm" style={{ height: `${h * 0.65}%` }} />
            </div>
          ))}
        </div>
        <div className="px-6 pb-4 pt-3 border-t-2 border-[var(--black)] border-dashed flex justify-center gap-6">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

function TransactionsTableSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-24 opacity-30" />
          <Skeleton className="h-6 w-44 opacity-30" />
        </div>
        <Skeleton className="h-9 w-24 rounded-xl opacity-30" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-[var(--black)] bg-[var(--main-bg)]">
            {[200, 80, 80, 100, 80].map((w, i) => (
              <th key={i} className="p-4 text-left">
                <Skeleton className="h-3" style={{ width: w }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="border-b-2 border-[var(--black)]">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </td>
              <td className="p-4"><Skeleton className="h-4 w-20" /></td>
              <td className="p-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </td>
              <td className="p-4"><Skeleton className="h-3 w-12" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AccountsSkeleton() {
  return (
    <main className="min-h-screen mx-auto space-y-8">
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Bank cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARD_COLORS.map((color, i) => (
          <BankCardSkeleton key={i} color={color} />
        ))}
      </div>

      {/* Summary bar */}
      <SummaryBarSkeleton />

      {/* Charts */}
      <AnalyticsChartsSkeleton />

      {/* Transactions */}
      <TransactionsTableSkeleton />
    </main>
  );
}
