import { Target, Calendar } from "lucide-react";
import type { GoalSummary } from "../types/dashboard";

type Props = {
  goal: GoalSummary;
};

export function NextGoalCard({ goal }: Props) {
  return (
    <div className="bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] p-6 w-full h-full shadow-[var(--neo-shadow)] relative overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* Removido o Glow de fundo (blur não combina com neo-brutalismo). 
          O estilo agora aposta em blocos de cor sólidos. */}

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Topo: Identificação e Badge */}
        <div>
          <header className="flex justify-between items-center mb-5">
            <span className="text-[10px] font-black uppercase text-[var(--main-bg)] opacity-80 tracking-[0.2em]">
              Próximo Objetivo
            </span>
            {/* Badge adaptado para ter borda preta grossa e fundo amarelo forte */}
            <div className="flex items-center gap-1.5 text-[var(--primary)] bg-[var(--secondary)] px-3 py-1 rounded-full border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]">
              <Target size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {Number(goal.percentage)}%
              </span>
            </div>
          </header>

          <h2 className="text-3xl leading-tight font-black text-[var(--main-bg)] uppercase tracking-tighter mb-4">
            {goal.name}
          </h2>

          {/* Badge de data transformado em um bloco com contraste */}
          <div className="flex items-center gap-2 text-[var(--primary)] bg-[var(--main-bg)] w-fit px-2.5 py-1 rounded-md border-2 border-[var(--black)]">
            <Calendar size={12} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Prazo: {new Date(goal.date).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        {/* Rodapé: Valores e Barra */}
        <div className="space-y-4 mt-8">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-wider mb-1">
                Progresso Atual
              </span>
              <span className="text-3xl font-black text-[var(--secondary)] leading-none tracking-tighter">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(goal.current))}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-wider mb-1">
                Alvo
              </span>
              <span className="text-sm font-bold text-[var(--main-bg)] tracking-tight">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(goal.target))}
              </span>
            </div>
          </div>

          {/* Barra de progresso bruta: Fundo claro, preenchimento amarelo, divisor preto */}
          <div className="w-full h-4 bg-[var(--main-bg)] rounded-full overflow-hidden border-2 border-[var(--black)]">
            <div
              className="h-full bg-[var(--secondary)] border-r-2 border-[var(--black)] transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, Number(goal.percentage))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
