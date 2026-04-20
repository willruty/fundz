import type { CategoryDistribution } from "../types/dashboard";

const COLORS = ["#08233e", "#ffd100", "#22c55e", "#f97316", "#a855f7"];

type Props = { distribution: CategoryDistribution[] };

export function CategoryDistributionCard({ distribution = [] }: Props) {
  const data = distribution.slice(0, 5);
  const total = data.reduce((a, b) => a + Number(b.amount), 0);
  const maxAmount =
    data.length > 0 ? Math.max(...data.map((d) => Number(d.amount))) : 1;

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] px-4 py-4 w-full h-full shadow-[var(--neo-shadow)] flex flex-col transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3 font-black uppercase text-[var(--black-muted)] tracking-widest">
          Distribuição por Categoria
        </span>
        <span className="text-sm font-black text-[var(--primary)]">
          {fmt(total)}
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1 justify-between">
        {data.map((item, index) => {
          const pct =
            total > 0 ? Math.round((Number(item.amount) / total) * 100) : 0;
          const barWidth =
            maxAmount > 0
              ? Math.max(5, Math.round((Number(item.amount) / maxAmount) * 100))
              : 5;

          return (
            <div key={item.name} className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className="w-2.5 h-2.5 border-2 border-[var(--black)] shrink-0 shadow-[1px_1px_0_rgba(0,0,0,0.8)]"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-[14px] font-black uppercase text-[var(--primary)] tracking-wide truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-[14px] font-black text-[var(--primary)] shrink-0 ml-2">
                  {pct}%
                </span>
              </div>
              <div className="h-4 w-full bg-gray-100 border-2 border-[var(--black)] rounded-sm overflow-hidden shadow-[1px_1px_0_rgba(0,0,0,0.6)]">
                <div
                  className="h-full transition-all duration-700 ease-out"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
