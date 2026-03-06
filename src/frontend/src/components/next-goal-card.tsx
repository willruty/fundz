import { Target, Calendar } from "lucide-react";
import type { GoalSummary } from "../types/dashboard";

type Props = {
  goal: GoalSummary;
};

export function NextGoalCard({ goal }: Props) {
  return (
    <div className="bg-primary border border-white/5 rounded-[32px] p-8 w-full h-full shadow-2xl relative overflow-hidden group flex flex-col justify-between">
      {/* Glow de fundo indicando progresso */}
      <div
        className="absolute -right-4 -top-4 w-24 h-24 bg-[#FFD100] opacity-5 rounded-full blur-3xl transition-all duration-500 group-hover:opacity-10"
        style={{ opacity: 0.05 + Number(goal.percentage) / 1000 }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Topo: Identificação e Badge */}
        <div>
          <header className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">
              Próximo Objetivo
            </span>
            <div className="flex items-center gap-1.5 text-[#FFD100] bg-[#FFD100]/10 px-3 py-1 rounded-full border border-[#FFD100]/20">
              <Target size={12} />
              <span className="text-[10px] font-black uppercase">
                {Number(goal.percentage)}%
              </span>
            </div>
          </header>

          <h2 className="text-[1.75rem] leading-tight font-black text-white uppercase tracking-tighter mb-1">
            {goal.name}
          </h2>

          <div className="flex items-center gap-2 text-white/40">
            <Calendar size={12} />
            <span className="text-[10px] font-bold">
              Prazo: {new Date(goal.date).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        {/* Rodapé: Valores e Barra (Empurrados para o fundo) */}
        <div className="space-y-4 mt-8">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/30 uppercase mb-1">
                Progresso Atual
              </span>
              <span className="text-3xl font-black text-[#FFD100] leading-none">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(goal.current))}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-white/30 uppercase mb-1">
                Alvo
              </span>
              <span className="text-xs font-bold text-white/60">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(goal.target))}
              </span>
            </div>
          </div>

          <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
            <div
              className="h-full bg-[#FFD100] rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,209,0,0.4)]"
              style={{ width: `${Math.min(100, Number(goal.percentage))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
