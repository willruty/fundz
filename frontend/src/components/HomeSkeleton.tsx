import { Skeleton } from "./ui/Skeleton";

// Espelha o card bg-[var(--secondary)] de saldo total + receita vs despesa
function BalanceSkeleton() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Saldo Total */}
      <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-6 shadow-[var(--neo-shadow)] min-h-[160px] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-12 w-48 mt-2" />
      </div>

      {/* Receita vs Despesa */}
      <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-5 shadow-[var(--neo-shadow)] flex flex-col gap-5 flex-1">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="w-2 h-2 rounded-full" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full rounded-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full rounded-sm" />
          </div>
        </div>
        <div className="mt-auto pt-3 border-t-2 border-black/10 border-dashed flex justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 w-14 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// Espelha o NextGoalCard (fundo escuro)
function NextGoalSkeleton() {
  return (
    <div className="bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] p-6 shadow-[var(--neo-shadow)] flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-5">
        <Skeleton className="h-3 w-28 opacity-30" />
        <Skeleton className="h-6 w-14 rounded-full opacity-30" />
      </div>
      <Skeleton className="h-9 w-3/4 mb-3 opacity-30" />
      <Skeleton className="h-6 w-32 rounded-md mb-8 opacity-30" />
      <div className="space-y-4 mt-auto">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-24 opacity-30" />
            <Skeleton className="h-8 w-28 opacity-30" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-2.5 w-10 opacity-30" />
            <Skeleton className="h-4 w-20 opacity-30" />
          </div>
        </div>
        <Skeleton className="h-4 w-full rounded-full opacity-30" />
      </div>
    </div>
  );
}

// Espelha o MonthlyBalanceCard (gráfico de área)
function MonthlyBalanceSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-6 shadow-[var(--neo-shadow)] flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2.5 w-28" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
      {/* Simula o gráfico com barras irregulares */}
      <div className="flex-grow flex items-end gap-1 min-h-[200px] px-2">
        {[40, 65, 45, 80, 55, 70, 50, 90, 60, 75, 45, 85].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-4 pt-4 border-t-2 border-black/10 border-dashed flex justify-between">
        <Skeleton className="h-3 w-36" />
        <div className="flex gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

// Espelha o CategoryAnalysisCard (fundo amarelo)
function CategoryAnalysisSkeleton() {
  return (
    <div className="bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] p-5 shadow-[var(--neo-shadow)] flex flex-col gap-4 h-full">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-24 opacity-40" />
          <Skeleton className="h-6 w-32 opacity-40" />
        </div>
        <Skeleton className="w-9 h-9 rounded-xl opacity-40" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-7 w-40 opacity-40" />
        <Skeleton className="h-9 w-32 opacity-40" />
      </div>
      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex justify-between">
          <Skeleton className="h-2.5 w-28 opacity-40" />
          <Skeleton className="h-2.5 w-8 opacity-40" />
        </div>
        <Skeleton className="h-3 w-full rounded-sm opacity-40" />
      </div>
      <div className="pt-3 border-t-2 border-black/20 border-dashed">
        <Skeleton className="h-7 w-20 rounded-md opacity-40" />
      </div>
    </div>
  );
}

// Espelha o CategoryDistributionCard (barras horizontais)
function CategoryDistributionSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-5 shadow-[var(--neo-shadow)] flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2.5 w-36" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-2.5 w-8" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-around gap-2 min-h-[120px]">
        {[75, 55, 40, 30, 20].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-5 rounded-sm" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
      <div className="pt-3 border-t-2 border-black/10 border-dashed flex flex-wrap gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Skeleton className="w-3 h-3" />
            <Skeleton className="h-2.5 w-14" />
            <Skeleton className="h-4 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Espelha a tabela RecentTransactions
function RecentTransactionsSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b-2 border-[var(--black)] flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-28" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[var(--black)] bg-[var(--main-bg)]">
              {[140, 80, 80, 100, 80].map((w, i) => (
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
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3 w-32" />
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
      </div>
      {/* Footer paginação */}
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

export function HomeSkeleton() {
  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-5">
        {/* Linha 1: Account badges */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-3">
            {[120, 140, 110].map((w, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] pr-5 overflow-hidden"
              >
                <Skeleton className="w-2 self-stretch shrink-0 rounded-none border-0" />
                <Skeleton className="w-11 h-11 rounded-full border-2 border-[var(--black)] my-3" />
                <div className="flex flex-col gap-1.5 py-3">
                  <Skeleton className="h-2.5" style={{ width: w - 30 }} />
                  <Skeleton className="h-5" style={{ width: w }} />
                </div>
                <div className="w-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Linha 2: Balance + Goal */}
        <div className="flex flex-row gap-5">
          <div className="flex-1"><BalanceSkeleton /></div>
          <div className="flex-1"><NextGoalSkeleton /></div>
        </div>
        <div className="w-full"><MonthlyBalanceSkeleton /></div>

        {/* Linha 3: Saúde Financeira */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-6 shadow-[var(--neo-shadow)]">
            <div className="flex justify-between items-center mb-5">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-9 h-9 rounded-lg" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2.5 w-12" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  {i < 2 && <div className="border-t-2 border-black/10 border-dashed mt-4" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Linha 4: Categorias */}
        <div className="w-full"><CategoryAnalysisSkeleton /></div>
        <div className="w-full"><CategoryDistributionSkeleton /></div>

        {/* Linha 5: Transações */}
        <div className="w-full lg:col-span-2">
          <RecentTransactionsSkeleton />
        </div>
      </div>
    </main>
  );
}
