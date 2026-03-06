import { TrendingUp, AlertTriangle } from "lucide-react";
import type { CategoryMostUsed } from "../types/dashboard";

type Props = {
  most_used: CategoryMostUsed;
};

export function CategoryAnalysisCard({ most_used }: Props) {
  const topCategory = { name: "Alimentação", value: 1250.8, trend: 12 };

  return (
    <div className="bg-secondary border border-white/5 rounded-[32px] p-8 w-full h-[220px] shadow-2xl relative overflow-hidden group flex flex-col justify-between">
      {/* Detalhe de fundo suave para profundidade */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-opacity" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <header className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em]">
              Insight de Gastos
            </span>
            <h3 className="text-primary font-black text-xl uppercase italic leading-none mt-1">
              Maior Volume
            </h3>
          </div>
          <div className="p-3 bg-primary/10 rounded-2xl">
            <AlertTriangle size={18} className="text-primary" />
          </div>
        </header>

        <div className="flex flex-col">
          <h2 className="text-4xl font-black text-primary tracking-tighter uppercase leading-none">
            {most_used.name}
          </h2>
          <p className="text-primary/60 font-bold text-lg mt-1">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(most_used.amount))}
          </p>
        </div>

        <footer className="pt-4 border-t border-primary/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-primary text-secondary px-3 py-1 rounded-full text-[10px] font-black">
              <TrendingUp size={12} />
              {topCategory.trend}%
            </div>
            <span className="text-[10px] font-black text-primary/40 uppercase tracking-wider">
              vs. mês anterior
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
