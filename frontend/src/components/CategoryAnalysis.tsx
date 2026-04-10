import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import type { CategoryMostUsed } from "../types/dashboard";

type Props = {
  most_used: CategoryMostUsed;
};

export function CategoryAnalysisCard({ most_used }: Props) {
  const trend = 12;
  const isUp = trend > 0;

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  // Simula um "budget" para a categoria para exibir barra de uso
  const budgetLimit = Number(most_used.amount) * 1.25;
  const usedPct = Math.min(100, Math.round((Number(most_used.amount) / budgetLimit) * 100));

  return (
    <div className="bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] p-5 w-full h-full shadow-[var(--neo-shadow)] relative flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">

      {/* Decoração de fundo */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-3 -bottom-4 text-[110px] font-black text-[var(--primary)] opacity-[0.06] leading-none"
      >
        %
      </span>

      <div className="relative z-10 flex flex-col h-full gap-3">
        {/* Cabeçalho */}
        <header className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest mb-0.5 block">
              Insight de Gastos
            </span>
            <h3 className="text-[var(--primary)] font-black text-xl uppercase tracking-tighter leading-none">
              Maior Volume
            </h3>
          </div>
          <div className="p-2 bg-[var(--primary)] border-2 border-[var(--black)] rounded-xl shadow-[var(--neo-shadow-hover)] flex items-center justify-center">
            <AlertTriangle size={14} strokeWidth={2.5} className="text-[var(--secondary)]" />
          </div>
        </header>

        {/* Categoria + valor */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-[var(--primary)] tracking-tighter uppercase leading-none truncate">
            {most_used.name}
          </h2>
          <p className="text-3xl font-black text-[var(--primary)] mt-1 tracking-tight">
            {fmt(Number(most_used.amount))}
          </p>
        </div>

        {/* Barra de uso do orçamento */}
        <div className="flex flex-col gap-1 mt-auto">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black uppercase text-[var(--primary)] opacity-70 tracking-wider">
              Uso do orçamento
            </span>
            <span className="text-[9px] font-black uppercase text-[var(--primary)] tracking-wider">
              {usedPct}%
            </span>
          </div>
          <div className="h-3 w-full bg-white border-2 border-[var(--black)] rounded-sm overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] border-r-2 border-[var(--black)] transition-all duration-1000 ease-out"
              style={{ width: `${usedPct}%` }}
            />
          </div>
        </div>

        {/* Rodapé: tendência */}
        <footer className="pt-3 border-t-2 border-[var(--black)] border-dashed">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border-2 border-[var(--black)] text-[10px] font-black shadow-[var(--neo-shadow-hover)] ${
                isUp
                  ? "bg-[var(--primary)] text-[var(--secondary)]"
                  : "bg-emerald-400 text-[var(--primary)]"
              }`}
            >
              {isUp ? (
                <TrendingUp size={12} strokeWidth={3} />
              ) : (
                <TrendingDown size={12} strokeWidth={3} />
              )}
              {isUp ? "+" : "-"}{Math.abs(trend)}%
            </div>
            <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider">
              vs. mês anterior
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
