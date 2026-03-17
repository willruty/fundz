import { TrendingUp, AlertTriangle } from "lucide-react";
import type { CategoryMostUsed } from "../types/dashboard";

type Props = {
  most_used: CategoryMostUsed;
};

export function CategoryAnalysisCard({ most_used }: Props) {
  // Mantendo a variável mockada do seu código original
  const topCategory = { name: "Alimentação", value: 1250.8, trend: 12 };

  return (
    // Reduzi o padding para p-4 (sm:p-5) e removi o min-h-[220px]
    <div className="bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] p-4 sm:p-5 w-full h-full shadow-[var(--neo-shadow)] relative flex flex-col justify-between transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* Reduzi o gap geral de gap-4 para gap-2 */}
      <div className="relative z-10 flex flex-col h-full justify-between gap-2">
        {/* Cabeçalho */}
        <header className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest mb-0.5">
              Insight de Gastos
            </span>
            {/* Fonte reduzida de text-2xl para text-xl para economizar espaço */}
            <h3 className="text-[var(--primary)] font-black text-lg sm:text-xl uppercase tracking-tighter leading-none">
              Maior Volume
            </h3>
          </div>

          {/* Padding do ícone reduzido para deixar o "botão" menor */}
          <div className="p-1.5 sm:p-2 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-xl shadow-[var(--neo-shadow-hover)] flex items-center justify-center">
            <AlertTriangle
              size={16}
              strokeWidth={2.5}
              className="text-[var(--primary)]"
            />
          </div>
        </header>

        {/* Corpo: Nome e Valor */}
        <div className="flex flex-col mt-1">
          {/* Nome da categoria reduzido de text-4xl para text-3xl */}
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--primary)] tracking-tighter uppercase leading-none truncate">
            {most_used.name}
          </h2>
          {/* Valor reduzido de text-xl para text-lg */}
          <p className="text-[var(--black-muted)] font-black text-4xl mt-1 tracking-tight">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(most_used.amount))}
          </p>
        </div>

        {/* Rodapé: Tendência e Comparação */}
        {/* Margens e paddings reduzidos de pt-4 mt-auto para pt-3 mt-2 */}
        <footer className="pt-3 border-t-2 border-[var(--black)] border-dashed mt-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[var(--primary)] text-[var(--secondary)] px-2 py-0.5 rounded-md border-2 border-[var(--black)] text-[10px] font-black shadow-[var(--neo-shadow-hover)]">
              <TrendingUp size={12} strokeWidth={3} />
              {topCategory.trend}%
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
