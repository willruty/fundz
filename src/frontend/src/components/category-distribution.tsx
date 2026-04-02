import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { CategoryDistribution } from "../types/dashboard";

const COLORS = [
  "#08233e", // --primary
  "#ffd100", // --secondary
  "#22c55e", // green
  "#f97316", // orange
  "#a855f7", // purple
];

type Props = { distribution: CategoryDistribution[] };

export function CategoryDistributionCard({ distribution = [] }: Props) {
  const hasData = distribution && distribution.length > 0;
  const topCategory = hasData ? distribution[0].name : "N/A";
  const bottomCategory = hasData ? distribution[distribution.length - 1].name : "N/A";
  const total = distribution.reduce((a, b) => a + Number(b.amount), 0);

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const pct = total > 0 ? Math.round((payload[0].value / total) * 100) : 0;
    return (
      <div className="bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 min-w-[140px]">
        <p className="text-[10px] font-black uppercase text-[var(--black-muted)] mb-1 pb-1 border-b-2 border-[var(--black)] border-dashed">
          {payload[0].name ?? payload[0].payload?.name}
        </p>
        <div className="flex justify-between items-center gap-4">
          <span className="text-[10px] font-bold uppercase text-[var(--black-muted)]">Valor:</span>
          <span className="text-xs font-black text-[var(--primary)]">{fmt(payload[0].value)}</span>
        </div>
        <div className="mt-2 pt-2 border-t-2 border-[var(--black)] flex justify-between items-center bg-[var(--secondary)] -mx-3 -mb-3 px-3 py-2 rounded-b-md">
          <span className="text-[10px] font-black uppercase text-[var(--primary)]">%:</span>
          <span className="text-sm font-black text-[var(--primary)]">{pct}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-4 sm:p-5 w-full h-full shadow-[var(--neo-shadow)] relative flex flex-col justify-between transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">

      <header className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[9px] font-black uppercase text-[var(--black-muted)] tracking-widest mb-2 block">
            Distribuição por Categoria
          </span>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 border-2 border-[var(--black)] rounded-md bg-emerald-400 text-[9px] font-black text-[var(--primary)] uppercase shadow-[var(--neo-shadow-hover)]">
              <TrendingUp size={10} strokeWidth={3} /> {topCategory}
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 border-2 border-[var(--black)] rounded-md bg-red-400 text-[9px] font-black text-white uppercase shadow-[var(--neo-shadow-hover)]">
              <TrendingDown size={10} strokeWidth={3} /> {bottomCategory}
            </div>
          </div>
        </div>
        {/* Total */}
        <div className="flex flex-col items-end shrink-0 ml-2">
          <span className="text-[9px] font-black uppercase text-[var(--black-muted)] tracking-wider">Total</span>
          <span className="text-sm font-black text-[var(--primary)] tracking-tight">{fmt(total)}</span>
        </div>
      </header>

      <div className="flex-grow w-full min-h-[120px] mb-2">
        <ResponsiveContainer width="100%" height="100%" minHeight={0}>
          <BarChart
            data={distribution}
            layout="vertical"
            margin={{ left: 0, right: 8, top: 0, bottom: 0 }}
            barCategoryGap="18%"
          >
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" hide />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.04)", stroke: "var(--black)", strokeWidth: 1 }}
            />
            <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={18} stroke="var(--black)" strokeWidth={2}>
              {distribution.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-2 pt-3 border-t-2 border-[var(--black)] border-dashed">
        {distribution.map((item, index) => {
          const pct = total > 0 ? Math.round((Number(item.amount) / total) * 100) : 0;
          return (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider">
                {item.name}
              </span>
              <span className="text-[9px] font-bold text-[var(--primary)] bg-[var(--secondary)] px-1.5 py-0.5 rounded border-2 border-[var(--black)]">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
