import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import type { AccountSummary, TransactionSummary } from "../types/dashboard";

type BalanceCardProps = {
  accounts?: AccountSummary[] | null;
  transactions?: TransactionSummary[] | null;
};

export function BalanceCard({ accounts = [], transactions = [] }: BalanceCardProps) {
  const balance =
    accounts?.reduce((acc, account) => acc + Number(account.balance ?? 0), 0) ?? 0;

  const summary =
    transactions?.reduce(
      (acc, t) => {
        const amount = Number(t.value ?? 0);
        if (t.type === "income") acc.income += amount;
        else if (t.type === "expense") acc.expense += amount;
        return acc;
      },
      { income: 0, expense: 0 } as { income: number; expense: number },
    ) ?? { income: 0, expense: 0 };

  const savingsRate =
    summary.income > 0
      ? Math.round(((summary.income - summary.expense) / summary.income) * 100)
      : 0;

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const totalFlow = summary.income + summary.expense || 1;
  const incomePct = Math.min(100, (summary.income / totalFlow) * 100);
  const expensePct = Math.min(100, (summary.expense / totalFlow) * 100);

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* ── CARD 1: SALDO TOTAL ── */}
      <div className="bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] p-6 w-full shadow-[var(--neo-shadow)] relative overflow-hidden group min-h-[160px] flex flex-col justify-between transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">

        {/* Decoração de fundo: "R$" gigante e desbotado */}
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-4 -bottom-6 text-[140px] font-black text-[var(--primary)] opacity-[0.07] leading-none tracking-tighter"
        >
          R$
        </span>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase text-[var(--black)] tracking-[0.2em]">
              Saldo Total
            </span>
            <div className="flex items-center gap-1.5 bg-white border-2 border-[var(--black)] px-2 py-0.5 rounded-full shadow-[var(--neo-shadow-hover)]">
              <Zap size={10} strokeWidth={3} className="text-[var(--primary)]" />
              <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider">
                Live
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[var(--primary)] tracking-tighter leading-none">
            {fmt(balance)}
          </h2>
        </div>
      </div>

      {/* ── CARD 2: RECEITA VS DESPESA ── */}
      <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-5 w-full h-full shadow-[var(--neo-shadow)] flex flex-col justify-between group transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">

        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-black uppercase text-[var(--black-muted)] tracking-wider">
            Receita vs Despesa
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 border-2 border-[var(--black)] animate-pulse" />
        </div>

        <div className="flex flex-col gap-4">
          {/* Entradas */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <TrendingUp size={13} strokeWidth={3} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-wider">
                  Entradas
                </span>
              </div>
              <span className="text-base font-black text-emerald-600 tracking-tighter">
                {fmt(summary.income)}
              </span>
            </div>
            <div className="h-4 w-full bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-sm overflow-hidden">
              <div
                className="h-full bg-emerald-400 border-r-2 border-[var(--black)] transition-all duration-1000"
                style={{ width: `${incomePct}%` }}
              />
            </div>
          </div>

          {/* Saídas */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <TrendingDown size={13} strokeWidth={3} className="text-red-500" />
                <span className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-wider">
                  Saídas
                </span>
              </div>
              <span className="text-base font-black text-red-500 tracking-tighter">
                {fmt(summary.expense)}
              </span>
            </div>
            <div className="h-4 w-full bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-sm overflow-hidden">
              <div
                className="h-full bg-red-400 border-r-2 border-[var(--black)] transition-all duration-1000"
                style={{ width: `${expensePct}%` }}
              />
            </div>
          </div>
        </div>

        <footer className="mt-4 pt-3 border-t-2 border-[var(--black)] border-dashed flex justify-between items-center">
          <span className="text-[10px] font-bold text-[var(--black-muted)] uppercase tracking-wider">
            Taxa de Poupança
          </span>
          <span
            className={`text-sm font-black px-3 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] ${
              savingsRate >= 0
                ? "bg-emerald-400 text-[var(--primary)]"
                : "bg-red-400 text-white"
            }`}
          >
            {savingsRate}%
          </span>
        </footer>
      </div>
    </div>
  );
}
