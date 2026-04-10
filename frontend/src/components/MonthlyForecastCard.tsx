export function MonthlyForecastCard({
  dailyAverage = 142.5,
  daysInMonth = 30,
  budgetLimit = 5000,
}) {
  const forecastedAmount = dailyAverage * daysInMonth;
  const usedPct = Math.min(100, Math.round((forecastedAmount / budgetLimit) * 100));
  const isOverBudget = forecastedAmount > budgetLimit;

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="flex flex-col justify-between p-6 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 cursor-default h-full">

      <div>
        <h3 className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest mb-1">
          Previsão Mensal
        </h3>
        <h2 className="text-4xl font-black text-[var(--primary)] tracking-tighter">
          {fmt(forecastedAmount)}
        </h2>
        <p className="text-[10px] font-bold text-[var(--black-light)] uppercase tracking-wider mt-1">
          Base: {fmt(dailyAverage)}/dia × {daysInMonth} dias
        </p>
      </div>

      {/* Gauge de orçamento */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider">
            Limite do orçamento
          </span>
          <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">
            {usedPct}%
          </span>
        </div>

        {/* Barra de progresso chunky */}
        <div className="h-5 w-full bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-sm overflow-hidden">
          <div
            className="h-full border-r-2 border-[var(--black)] transition-all duration-1000 ease-out"
            style={{
              width: `${usedPct}%`,
              background: isOverBudget ? "#FF3B3B" : "var(--primary)",
            }}
          />
        </div>

        <div className="flex items-center justify-between bg-[var(--primary)] border-2 border-[var(--black)] rounded-md px-3 py-2 shadow-[var(--neo-shadow-hover)]">
          <span className="text-[10px] font-black text-[var(--main-bg)] uppercase tracking-wide">
            {isOverBudget ? "⚠ Acima do limite" : "✓ Dentro do limite"}
          </span>
          <span
            className="text-[9px] font-black px-2 py-0.5 border-2 border-[var(--black)] rounded uppercase tracking-wider"
            style={{
              background: isOverBudget ? "#FF3B3B" : "var(--secondary)",
              color: isOverBudget ? "#fff" : "var(--primary)",
            }}
          >
            {isOverBudget ? "ALERTA" : "OK"}
          </span>
        </div>
      </div>
    </div>
  );
}
