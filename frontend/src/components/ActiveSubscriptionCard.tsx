import { RefreshCw, CreditCard } from "lucide-react";

interface ActiveSubscriptionsCardProps {
  total: number;
  subscriptionsCount: number;
  installmentsCount: number;
}

export default function ActiveSubscriptionsCard({
  total,
  subscriptionsCount,
  installmentsCount,
}: ActiveSubscriptionsCardProps) {
  const subPct  = total > 0 ? Math.round((subscriptionsCount / total) * 100) : 0;
  const instPct = total > 0 ? Math.round((installmentsCount  / total) * 100) : 0;

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

      <div className="flex-grow flex items-center justify-start">
        <span className="text-6xl md:text-7xl font-black text-[var(--primary)] tracking-tighter drop-shadow-sm">
          {total}
        </span>
      </div>

      <div className="mt-4 space-y-2">
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[var(--primary)] border-2 border-[var(--black)]" />
            <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider">
              {subscriptionsCount} assinatura{subscriptionsCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[var(--secondary)] border-2 border-[var(--black)]" />
            <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider">
              {installmentsCount} parcelamento{installmentsCount !== 1 ? "s" : ""}
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
