import React from "react";

// 1. Interface de tipos para os dados
interface ActiveSubscriptionsData {
  activeSubscriptions: number;
}

// 2. Mock de dados
const mockData: ActiveSubscriptionsData = {
  activeSubscriptions: 12,
};

// 3. Componente Principal
export default function ActiveSubscriptionsCard() {
  return (
    <div className="flex flex-col w-full h-full p-6 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* Topo: Título do card */}
      <h2 className="text-xs font-black text-[var(--black-muted)] uppercase tracking-widest mb-4">
        Custos fixos ativos
      </h2>

      {/* Centro: Número principal destacado */}
      <div className="flex-grow flex items-center justify-start">
        <span className="text-6xl md:text-7xl font-black text-[var(--primary)] tracking-tighter drop-shadow-sm">
          {mockData.activeSubscriptions}
        </span>
      </div>

      {/* Rodapé: Subtítulo explicativo */}
      <div className="mt-4 pt-4 border-t-2 border-[var(--black)] border-dashed">
        <p className="text-[10px] font-bold text-[var(--black-light)] uppercase tracking-wider leading-relaxed">
          Assinaturas, parcelamentos e financiamentos ativos
        </p>
      </div>
    </div>
  );
}
