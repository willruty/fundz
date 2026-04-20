import { Activity, TrendingDown, Landmark, PiggyBank } from "lucide-react";
import type { FinancialHealth, FinancialHealthIndicator, HealthLevel } from "../types/dashboard";

type Props = {
  health?: FinancialHealth | null;
};

const levelConfig: Record<HealthLevel, { bg: string; text: string; label: string }> = {
  bom:         { bg: "bg-emerald-400", text: "text-emerald-900", label: "Bom" },
  "atenção":   { bg: "bg-amber-400",   text: "text-amber-900",  label: "Atenção" },
  "crítico":   { bg: "bg-red-400",     text: "text-red-900",    label: "Crítico" },
  baixo:       { bg: "bg-emerald-400", text: "text-emerald-900", label: "Baixo" },
  moderado:    { bg: "bg-amber-400",   text: "text-amber-900",  label: "Moderado" },
  alto:        { bg: "bg-red-400",     text: "text-red-900",    label: "Alto" },
  ruim:        { bg: "bg-red-400",     text: "text-red-900",    label: "Ruim" },
  "sem dados": { bg: "bg-gray-300",    text: "text-gray-600",   label: "Sem dados" },
};

const levelBar: Record<HealthLevel, { filled: number; color: string }> = {
  bom:         { filled: 3, color: "#4ade80" },
  baixo:       { filled: 3, color: "#4ade80" },
  atenção:     { filled: 2, color: "#fbbf24" },
  moderado:    { filled: 2, color: "#fbbf24" },
  alto:        { filled: 1, color: "#f87171" },
  crítico:     { filled: 1, color: "#f87171" },
  ruim:        { filled: 1, color: "#f87171" },
  "sem dados": { filled: 0, color: "#9ca3af" },
};

const indicatorIcons: Record<string, typeof Activity> = {
  Gastos: TrendingDown,
  "Dívidas": Landmark,
  Investimentos: PiggyBank,
};

function StatusBlocks({ level }: { level: HealthLevel }) {
  const { filled, color } = levelBar[level];
  return (
    <div className="flex gap-0.5 shrink-0">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-4 h-3 border-2 border-[var(--black)] rounded-sm"
          style={{
            backgroundColor: i < filled ? color : "transparent",
            boxShadow: i < filled ? "1px 1px 0 rgba(0,0,0,0.7)" : "none",
          }}
        />
      ))}
    </div>
  );
}

function IndicatorRow({ indicator }: { indicator: FinancialHealthIndicator }) {
  const config = levelConfig[indicator.level];
  const Icon = indicatorIcons[indicator.label] ?? Activity;

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-12 m-2 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg flex items-center justify-center shadow-[var(--neo-shadow-hover)] shrink-0">
        <Icon size={16} strokeWidth={2.5} className="text-[var(--primary)]" />
      </div>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-black uppercase text-[var(--primary)] tracking-wider truncate">
            {indicator.label}
          </span>
          <StatusBlocks level={indicator.level} />
        </div>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[18px] font-bold text-[var(--black-muted)] truncate">
            {indicator.value}
          </span>
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border-2 border-[var(--black)] shrink-0 ${config.bg} ${config.text}`}
          >
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}

const emptyIndicator: FinancialHealthIndicator = { label: "", level: "sem dados", value: "—" };

export function FinancialHealthCard({ health }: Props) {
  const safeHealth: FinancialHealth = health ?? {
    gastos:        { ...emptyIndicator, label: "Gastos" },
    dividas:       { ...emptyIndicator, label: "Dívidas" },
    investimentos: { ...emptyIndicator, label: "Investimentos" },
  };

  const indicators = [safeHealth.gastos, safeHealth.dividas, safeHealth.investimentos];
  const goodCount = indicators.filter((i) => i.level === "bom" || i.level === "baixo").length;

  const overallLevel: HealthLevel =
    goodCount === 3 ? "bom" : goodCount >= 2 ? "atenção" : "crítico";
  const overallConfig = levelConfig[overallLevel];

  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-4 w-full h-full shadow-[var(--neo-shadow)] relative overflow-hidden flex flex-col gap-4 transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-2 -bottom-3 text-[90px] font-black text-[var(--primary)] opacity-[0.04] leading-none tracking-tighter"
      >
        ♥
      </span>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Activity size={12} strokeWidth={3} className="text-[var(--primary)]" />
          <span className="text-[12px] font-black uppercase text-[var(--black-muted)] tracking-[0.2em]">
            Saúde Financeira
          </span>
        </div>
        <div
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] ${overallConfig.bg} ${overallConfig.text}`}
        >
          <StatusBlocks level={overallLevel} />
          <span className="text-[12px] font-black uppercase tracking-wider">
            {overallConfig.label}
          </span>
        </div>
      </div>

      {/* Indicators */}
      <div className="flex flex-col gap-3 relative z-10">
        <IndicatorRow indicator={safeHealth.gastos} />
        <div className="border-t-2 border-dashed border-[var(--black)] opacity-40" />
        <IndicatorRow indicator={safeHealth.dividas} />
        <div className="border-t-2 border-dashed border-[var(--black)] opacity-40" />
        <IndicatorRow indicator={safeHealth.investimentos} />
      </div>
    </div>
  );
}
