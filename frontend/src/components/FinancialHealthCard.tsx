import { Activity, TrendingDown, Landmark, PiggyBank } from "lucide-react";
import type { FinancialHealth, FinancialHealthIndicator, HealthLevel } from "../types/dashboard";

type Props = {
  health?: FinancialHealth | null;
};

const levelConfig: Record<HealthLevel, { bg: string; text: string; label: string }> = {
  bom:        { bg: "bg-emerald-400", text: "text-emerald-900", label: "Bom" },
  "atenção":  { bg: "bg-amber-400",   text: "text-amber-900",  label: "Atenção" },
  "crítico":  { bg: "bg-red-400",     text: "text-red-900",    label: "Crítico" },
  baixo:      { bg: "bg-emerald-400", text: "text-emerald-900", label: "Baixo" },
  moderado:   { bg: "bg-amber-400",   text: "text-amber-900",  label: "Moderado" },
  alto:       { bg: "bg-red-400",     text: "text-red-900",    label: "Alto" },
  ruim:       { bg: "bg-red-400",     text: "text-red-900",    label: "Ruim" },
  "sem dados": { bg: "bg-gray-300",   text: "text-gray-600",   label: "Sem dados" },
};

const indicatorIcons: Record<string, typeof Activity> = {
  Gastos: TrendingDown,
  "Dívidas": Landmark,
  Investimentos: PiggyBank,
};

function IndicatorRow({ indicator }: { indicator: FinancialHealthIndicator }) {
  const config = levelConfig[indicator.level];
  const Icon = indicatorIcons[indicator.label] ?? Activity;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg flex items-center justify-center shadow-[var(--neo-shadow-hover)]">
          <Icon size={16} strokeWidth={2.5} className="text-[var(--primary)]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase text-[var(--black)] tracking-wider">
            {indicator.label}
          </span>
          <span className="text-[10px] font-bold text-[var(--black-muted)] tracking-wide">
            {indicator.value}
          </span>
        </div>
      </div>
      <span
        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    </div>
  );
}

const emptyIndicator: FinancialHealthIndicator = { label: "", level: "sem dados", value: "—" };

export function FinancialHealthCard({ health }: Props) {
  const safeHealth: FinancialHealth = health ?? {
    gastos: { ...emptyIndicator, label: "Gastos" },
    dividas: { ...emptyIndicator, label: "Dívidas" },
    investimentos: { ...emptyIndicator, label: "Investimentos" },
  };

  const indicators = [safeHealth.gastos, safeHealth.dividas, safeHealth.investimentos];

  const goodCount = indicators.filter(
    (i) => i.level === "bom" || i.level === "baixo"
  ).length;

  const overallLevel: HealthLevel =
    goodCount === 3 ? "bom" : goodCount >= 2 ? "atenção" : "crítico";
  const overallConfig = levelConfig[overallLevel];

  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-6 w-full h-full shadow-[var(--neo-shadow)] relative overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* Background decoration */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-3 -bottom-4 text-[120px] font-black text-[var(--primary)] opacity-[0.04] leading-none tracking-tighter"
      >
        +
      </span>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Activity size={14} strokeWidth={3} className="text-[var(--primary)]" />
            <span className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-[0.2em]">
              Saude Financeira
            </span>
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] ${overallConfig.bg} ${overallConfig.text}`}
          >
            {overallConfig.label}
          </span>
        </div>

        {/* Indicators */}
        <div className="flex flex-col gap-4">
          <IndicatorRow indicator={safeHealth.gastos} />
          <div className="border-t-2 border-[var(--black)] border-dashed" />
          <IndicatorRow indicator={safeHealth.dividas} />
          <div className="border-t-2 border-[var(--black)] border-dashed" />
          <IndicatorRow indicator={safeHealth.investimentos} />
        </div>
      </div>
    </div>
  );
}
