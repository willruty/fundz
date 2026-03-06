import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import type { TransactionSummary } from "../types/dashboard";

type Props = {
  last_month_transactions: TransactionSummary[];
};

export function MonthlyBalanceCard({ last_month_transactions = [] }: Props) {
  const chartData = [...last_month_transactions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((t) => ({
      date: new Date(t.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      value: Number(t.value) * (t.type === "expense" ? -1 : 1),
    }))
    .reduce((acc: any[], curr) => {
      const last = acc.length ? acc[acc.length - 1].value : 0;
      acc.push({
        ...curr,
        value: last + curr.value,
      });
      return acc;
    }, []);

  const monthlyBalance = chartData.reduce((acc, t) => acc + t.value, 0);
  const isPositive = monthlyBalance >= 0;

  const themeColor = isPositive ? "#10b981" : "#ef4444";

  return (
    <div className="bg-primary border border-white/5 rounded-4xl p-8 w-full h-full shadow-2xl relative overflow-hidden">
      <header className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] block mb-1">
            Performance Mensal
          </span>

          <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            Fluxo de Caixa
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}

              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Math.abs(monthlyBalance))}
            </div>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-white/30 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          <Calendar size={12} />
          <span className="text-[10px] font-black uppercase">
            Últimos 30 Dias
          </span>
        </div>
      </header>

      <div className="h-[185px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 15, left: 15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={themeColor} stopOpacity={0.7} />
                <stop offset="55%" stopColor={themeColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={themeColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="0" // Linha sólida fica mais clean se for bem sutil
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              interval={4} // Mostra de 5 em 5 (0, 5, 10...)
              tick={{
                fill: "rgba(255,255,255,0.4)",
                fontSize: 11,
                fontWeight: "500",
              }}
              dy={10}
            />

            {/* YAxis oculto para manter o foco no shape do gráfico */}
            <YAxis hide domain={["dataMin", "auto"]} />

            <Tooltip
              cursor={{
                stroke: themeColor,
                strokeWidth: 1,
                strokeDasharray: "4 4",
                opacity: 0.5,
              }}
              contentStyle={{
                backgroundColor: "#0F172A", // Tom levemente mais escuro/clássico
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                padding: "8px 12px",
              }}
              itemStyle={{
                color: "#FFF",
                fontSize: "13px",
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
              labelStyle={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
              }}
              formatter={(value: number | undefined) => [
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value ?? 0),
                "Saldo",
              ]}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={themeColor}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={false}
              // A MÁGICA ESTÁ AQUI:
              activeDot={{
                r: 6,
                strokeWidth: 0,
                fill: themeColor,
              }}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <footer className="mt-3 pt-5 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
        <span>Fundz Analytics Engine</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
            <span>Positivo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />{" "}
            <span>Negativo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
