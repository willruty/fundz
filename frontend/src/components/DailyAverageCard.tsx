export function DailyAverageCard() {
  const mockData = {
    title: "Média de Gasto",
    amount: "R$ 1.142,50",
    statusText: "23% acima do ideal",
    last7Days: [30, 50, 40, 80, 60, 100, 70],
  };

  return (
    <div className="flex flex-col justify-between p-6 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 cursor-default h-full">

      <div>
        <h3 className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest mb-1">
          {mockData.title}
        </h3>
        <h2 className="text-4xl font-black text-[#FF3B3B] m-0 tracking-tighter">
          {mockData.amount}
        </h2>
        <p className="text-[10px] font-bold text-[var(--black-light)] uppercase tracking-wider mt-1">
          Média diária do mês atual
        </p>
      </div>

      {/* Faixa de alerta + sparkline */}
      <div className="mt-6 bg-[var(--primary)] border-2 border-[var(--black)] rounded-xl shadow-[var(--neo-shadow-hover)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b-2 border-[var(--black)] border-dashed">
          <span className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-wide">
            ↑ {mockData.statusText}
          </span>
        </div>
        {/* Sparkline */}
        <div className="flex items-end gap-1 px-3 py-3 h-10">
          {mockData.last7Days.map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-sm transition-all duration-300"
              style={{
                height: `${height}%`,
                background: height === Math.max(...mockData.last7Days) ? "#FF3B3B" : "var(--secondary)",
                border: "1.5px solid var(--black)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
