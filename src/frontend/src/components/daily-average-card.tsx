export function DailyAverageCard() {
  const mockData = {
    title: "Média de Gasto",
    amount: "R$ 1142,50",
    statusText: "23% acima do ideal",
    last7Days: [30, 50, 40, 80, 60, 100, 70],
  };

  return (
    <div className="flex flex-col justify-between p-6 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_#000000] hover:bg-gray-50 transition-colors duration-200 cursor-default h-full">
      {/* Topo: Informação Direta e Hierarquia Limpa */}
      <div>
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">
          {mockData.title}
        </h3>
        {/* Tipografia massiva e limpa */}
        <h2 className="text-5xl font-black text-[#FF3B3B] m-0 tracking-tighter">
          {mockData.amount}
        </h2>
      </div>

      {/* Base: Psicologia das Cores (Alerta em Vermelho) */}
      <div className="mt-8 flex items-center justify-between bg-[#FF3B3B] border-[3px] border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_#000000]">
        <span className="text-xs font-black text-white uppercase tracking-wide">
          ↑ {mockData.statusText}
        </span>

        {/* Sparkline minimalista (Gráfico embutido) */}
        <div className="flex items-end gap-1 h-6">
          {mockData.last7Days.map((height, index) => (
            <div
              key={index}
              className="w-1.5 bg-black"
              style={{ height: `${height}%` }}
              title={`Dia ${index + 1}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
