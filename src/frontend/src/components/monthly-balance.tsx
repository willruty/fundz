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

  // Cores fortes para combinar com os tons sólidos do neo-brutalismo
  const themeColor = isPositive ? "#34d399" : "#f87171"; // emerald-400 ou red-400

  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-4 sm:p-6 w-full h-full shadow-[var(--neo-shadow)] relative flex flex-col justify-between transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* Cabeçalho */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
        <div>
          <span className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest block mb-1">
            Performance Mensal
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-[var(--primary)] uppercase tracking-tighter flex flex-wrap items-center gap-2 sm:gap-3">
            Fluxo de Caixa
            {/* Badge de Valor Bruto */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-sm sm:text-base border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] ${
                isPositive
                  ? "bg-emerald-400 text-[var(--primary)]"
                  : "bg-red-400 text-[var(--main-bg)]"
              }`}
            >
              {isPositive ? (
                <TrendingUp size={16} strokeWidth={3} />
              ) : (
                <TrendingDown size={16} strokeWidth={3} />
              )}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Math.abs(monthlyBalance))}
            </div>
          </h2>
        </div>

        {/* Badge de Período */}
        <div className="flex items-center gap-2 text-[var(--primary)] bg-[var(--secondary)] px-3 py-1.5 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]">
          <Calendar size={14} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Últimos 30 Dias
          </span>
        </div>
      </header>

      {/* Container do Gráfico Responsivo */}
      <div className="h-[200px] sm:h-[250px] w-full mt-2 mb-4 flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Gradiente mantido, mas com uma transição mais rústica */}
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={themeColor} stopOpacity={0.8} />
                <stop offset="70%" stopColor={themeColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={themeColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Linhas de grade mais "duras" para a estética brutalista */}
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--black)"
              strokeOpacity={0.15}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={{ stroke: "var(--black)", strokeWidth: 2 }}
              tickLine={{ stroke: "var(--black)", strokeWidth: 2 }}
              interval="preserveStartEnd" // Garante que o gráfico não esprema textos em mobile
              minTickGap={20}
              tick={{
                fill: "var(--black-muted)",
                fontSize: 12,
                fontWeight: "900",
                fontFamily: "inherit",
              }}
              dy={10}
            />

            <YAxis hide domain={["dataMin - 100", "auto"]} />

            {/* Tooltip personalizado Neo-brutalista */}
            <Tooltip
              cursor={{
                stroke: "var(--black)",
                strokeWidth: 2,
                strokeDasharray: "4 4",
                opacity: 0.5,
              }}
              contentStyle={{
                backgroundColor: "var(--main-bg)",
                border: "2px solid var(--black)",
                borderRadius: "8px",
                boxShadow: "4px 4px 0px 0px var(--black)",
                padding: "10px 14px",
              }}
              itemStyle={{
                color: "var(--primary)",
                fontSize: "16px",
                fontWeight: "900",
                textTransform: "capitalize",
              }}
              labelStyle={{
                color: "var(--black-muted)",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "4px",
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
              type="linear" // Tipo linear deixa as retas mais agressivas (menos curvas)
              dataKey="value"
              stroke={themeColor}
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={false}
              activeDot={{
                r: 6,
                stroke: "var(--black)",
                strokeWidth: 2,
                fill: themeColor,
              }}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Rodapé */}
      <footer className="mt-auto pt-4 border-t-2 border-[var(--black)] border-dashed flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[var(--black-muted)]">
        <span>Fundz Analytics Engine</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[var(--black)]" />
            <span className="text-[var(--primary)]">Positivo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400 border-2 border-[var(--black)]" />
            <span className="text-[var(--primary)]">Negativo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
