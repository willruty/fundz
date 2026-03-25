export function DailyAverageCard() {
  // Dados mockados
  const mockData = {
    title: "Média de Gasto por Dia",
    amount: "R$ 142,50",
    statusText: "Acima do limite ideal",
  };

  return (
    <div className="flex flex-col justify-center p-6 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_#ef4444] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#ef4444] transition-all duration-200 cursor-default">
      {/* Título do Card */}
      <span className="text-xs font-extrabold tracking-wider text-gray-600 uppercase mb-2">
        {mockData.title}
      </span>

      {/* Valor Principal */}
      <h2 className="text-3xl font-black text-black m-0">{mockData.amount}</h2>

      {/* Indicador de Status Pessimista */}
      <span className="text-xs font-bold text-red-500 mt-2 opacity-90">
        {mockData.statusText}
      </span>
    </div>
  );
}
