import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import type { TransactionSummary } from "../types/dashboard";

type Props = { transactions: TransactionSummary[] };

export function SavingsRateCard({ transactions }: Props) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.value), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.value), 0);

  const savings = income - expense;
  const rate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const isPositive = savings >= 0;

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Math.abs(v));

  let currentBalance = 0;
  const rawChartData = transactions.map((t) => {
    currentBalance += t.type === "income" ? Number(t.value) : -Number(t.value);
    return currentBalance;
  });

  const minBalance = Math.min(0, ...rawChartData);
  const chartData =
    rawChartData.length > 1
      ? rawChartData.map((val) => ({ value: val - minBalance }))
      : [{ value: 10 }, { value: 20 }, { value: 15 }, { value: 30 }];

  const chartColor = isPositive ? "#4ade80" : "#f87171";

  return (
    <div className="bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] p-5 w-full h-full shadow-[var(--neo-shadow)] relative overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] min-h-[200px]">
      {/* Background chart */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 30, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.9} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              fill="url(#chartGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-2 -bottom-3 text-[110px] font-black text-white opacity-[0.1] leading-none z-0"
      >
        %
      </span>

      <div className="relative z-10 flex flex-col h-full justify-between gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase text-[var(--secondary)] tracking-[0.2em]">
            Taxa de Poupança
          </span>
          <div className="p-2 bg-white/10 border-2 border-white/20 rounded-lg shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
            <Wallet
              size={14}
              strokeWidth={2.5}
              className="text-[var(--secondary)]"
            />
          </div>
        </div>

        {/* Main number */}
        <div className="flex flex-col gap-1">
          <div className="flex items-end gap-1 leading-none">
            <span
              className={`text-[56px] font-black leading-none tracking-tighter ${
                isPositive ? "text-[var(--secondary)]" : "text-red-400"
              }`}
            >
              {Math.abs(rate)}
            </span>
            <span className="text-[28px] font-black text-white mb-1">%</span>
          </div>
          <div
            className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp size={13} strokeWidth={3} />
            ) : (
              <TrendingDown size={13} strokeWidth={3} />
            )}
            {isPositive ? "da renda poupada" : "déficit mensal"}
          </div>
        </div>

        {/* Breakdown */}
        <div className="border-t-2 border-dashed border-white/20 pt-3 flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-black uppercase text-white/50 tracking-widest">
              Receitas
            </span>
            <span className="text-[13px] font-black text-emerald-400">
              {fmt(income)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-black uppercase text-white/50 tracking-widest">
              Despesas
            </span>
            <span className="text-[13px] font-black text-red-400">
              {fmt(expense)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
