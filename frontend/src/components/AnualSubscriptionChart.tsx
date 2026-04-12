import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface MonthlyCommitment {
  month: string;
  subscriptions: number;
  installments: number;
}

interface AnnualSubscriptionChartProps {
  data: MonthlyCommitment[];
}

type FilterType = "all" | "subscriptions" | "installments";

const COLORS = {
  subscriptions: "var(--primary)",
  installments:  "var(--secondary)",
};

export default function AnnualSubscriptionChart({ data }: AnnualSubscriptionChartProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const avgMonthly = data.length > 0
    ? Math.round(data.reduce((s, d) => s + d.subscriptions + d.installments, 0) / data.length)
    : 0;

  const peakMonth = data.reduce<MonthlyCommitment & { total: number }>(
    (max, d) =>
      d.subscriptions + d.installments > max.total
        ? { ...d, total: d.subscriptions + d.installments }
        : max,
    { month: "", total: 0, subscriptions: 0, installments: 0 }
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const total = payload.reduce((s: number, e: any) => s + e.value, 0);
    return (
      <div className="bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 min-w-[180px]">
        <p className="text-[10px] font-black uppercase text-[var(--black-muted)] mb-2 border-b-2 border-[var(--black)] border-dashed pb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, i: number) => (
            <div key={i} className="flex justify-between items-center gap-4">
              <span className="text-[10px] font-bold uppercase text-[var(--black-muted)]">
                {entry.name === "subscriptions" ? "Assinaturas" : "Parcelas"}:
              </span>
              <span className="text-xs font-black text-[var(--primary)]">{fmt(entry.value)}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t-2 border-[var(--black)] flex justify-between items-center bg-[var(--secondary)] -mx-3 -mb-3 px-3 py-2 rounded-b-md">
          <span className="text-[10px] font-black uppercase text-[var(--primary)]">Total:</span>
          <span className="text-sm font-black text-[var(--primary)]">{fmt(total)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">

      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-5 sm:px-6 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">
            Visão Anual
          </h3>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
            Projeção de Compromissos
          </h2>
          <p className="text-[10px] font-bold text-[var(--main-bg)] opacity-60 uppercase tracking-widest mt-1">
            Gastos recorrentes nos próximos 12 meses
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col items-end px-3 py-2 bg-white/10 border-2 border-white/20 rounded-md">
            <span className="text-[9px] font-black text-[var(--main-bg)] opacity-60 uppercase tracking-wider">Média/mês</span>
            <span className="text-sm font-black text-[var(--secondary)]">{fmt(avgMonthly)}</span>
          </div>
          {peakMonth.month && (
            <div className="flex flex-col items-end px-3 py-2 bg-white/10 border-2 border-white/20 rounded-md">
              <span className="text-[9px] font-black text-[var(--main-bg)] opacity-60 uppercase tracking-wider">Pico</span>
              <span className="text-sm font-black text-[var(--secondary)]">{peakMonth.month} · {fmt(peakMonth.total)}</span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-[var(--main-bg)] p-1.5 rounded-lg border-2 border-[var(--black)]">
            {(["all", "subscriptions", "installments"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-md transition-all border-2 cursor-pointer ${
                  filter === type
                    ? "bg-[var(--primary)] text-[var(--secondary)] border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                    : "bg-transparent text-[var(--black-muted)] border-transparent hover:text-[var(--primary)] hover:bg-black/5"
                }`}
              >
                {type === "all" ? "Todos" : type === "subscriptions" ? "Assinaturas" : "Parcelas"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--black)" strokeOpacity={0.15} vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={{ stroke: "var(--black)", strokeWidth: 2 }}
                tickLine={{ stroke: "var(--black)", strokeWidth: 2 }}
                tick={{ fill: "var(--black-muted)", fontSize: 11, fontWeight: "900" }}
                dy={10}
              />
              <YAxis
                tickFormatter={(v) => `R$${v}`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--black-muted)", fontSize: 11, fontWeight: "bold" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "var(--black)", strokeWidth: 2, strokeDasharray: "4 4", opacity: 0.5 }}
              />
              {(filter === "all" || filter === "subscriptions") && (
                <Area
                  type="linear" dataKey="subscriptions" name="subscriptions"
                  stackId="1" stroke="var(--black)" strokeWidth={3}
                  fill={COLORS.subscriptions} fillOpacity={0.9}
                />
              )}
              {(filter === "all" || filter === "installments") && (
                <Area
                  type="linear" dataKey="installments" name="installments"
                  stackId="1" stroke="var(--black)" strokeWidth={3}
                  fill={COLORS.installments} fillOpacity={0.9}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-6 pt-4 border-t-2 border-[var(--black)] border-dashed">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
              style={{ backgroundColor: COLORS.subscriptions }} />
            <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">Assinaturas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
              style={{ backgroundColor: COLORS.installments }} />
            <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">Parcelamentos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
