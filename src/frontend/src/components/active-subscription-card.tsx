import React from "react";
import { RefreshCw, CreditCard } from "lucide-react";

interface ActiveSubscriptionsData {
  activeSubscriptions: number;
  subscriptionsCount: number;
  installmentsCount: number;
}

const mockData: ActiveSubscriptionsData = {
  activeSubscriptions: 12,
  subscriptionsCount: 8,
  installmentsCount: 4,
};

export default function ActiveSubscriptionsCard() {
  const subPct = Math.round((mockData.subscriptionsCount / mockData.activeSubscriptions) * 100);
  const instPct = Math.round((mockData.installmentsCount / mockData.activeSubscriptions) * 100);

  return (
    <div className="flex flex-col w-full h-full p-6 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-black text-[var(--black-muted)] uppercase tracking-widest">
          Custos fixos ativos
        </h2>
        <div className="p-1.5 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-md shadow-[var(--neo-shadow-hover)]">
          <CreditCard size={14} strokeWidth={3} className="text-[var(--primary)]" />
        </div>
      </div>

      {/* Número principal */}
      <div className="flex-grow flex items-center justify-start">
        <span className="text-6xl md:text-7xl font-black text-[var(--primary)] tracking-tighter drop-shadow-sm">
          {mockData.activeSubscriptions}
        </span>
      </div>

      {/* Breakdown visual: assinaturas vs parcelamentos */}
      <div className="mt-4 space-y-2">
        {/* Barra combinada */}
        <div className="w-full h-3 border-2 border-[var(--black)] rounded-sm overflow-hidden flex">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-700"
            style={{ width: `${subPct}%` }}
          />
          <div
            className="h-full bg-[var(--secondary)] transition-all duration-700"
            style={{ width: `${instPct}%` }}
          />
        </div>

        {/* Legenda */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[var(--primary)] border-2 border-[var(--black)]" />
            <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider">
              {mockData.subscriptionsCount} assinatura{mockData.subscriptionsCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[var(--secondary)] border-2 border-[var(--black)]" />
            <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider">
              {mockData.installmentsCount} parcelamento{mockData.installmentsCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t-2 border-[var(--black)] border-dashed flex items-center gap-2">
        <RefreshCw size={11} strokeWidth={3} className="text-[var(--black-muted)] shrink-0" />
        <p className="text-[10px] font-bold text-[var(--black-light)] uppercase tracking-wider leading-relaxed">
          Cobranças ativas neste mês
        </p>
      </div>
    </div>
  );
}
