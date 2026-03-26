export function MonthlyForecastCard({
  dailyAverage = 142.5,
  daysInMonth = 30,
}) {
  // Lógica de projeção baseada no gasto diário
  const forecastedAmount = dailyAverage * daysInMonth;

  return (
    <div className="flex flex-col justify-between p-6 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_#000000] hover:bg-gray-50 transition-colors duration-200 cursor-default h-full">
      {/* Topo: Informação Direta e Hierarquia Limpa */}
      <div>
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">
          Previsão Mensal
        </h3>
        {/* Tipografia massiva acompanhando o card vizinho */}
        <h2 className="text-5xl font-black text-black m-0 tracking-tighter">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(forecastedAmount)}
        </h2>
      </div>

      {/* Base: Bloco de Contexto (Neutro/Informativo) */}
      <div className="mt-8 flex items-center justify-between bg-gray-100 border-[3px] border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_#000000]">
        <span className="text-[11px] font-black text-black uppercase tracking-wide">
          Base: R$ {dailyAverage.toFixed(2).replace(".", ",")} / dia
        </span>

        {/* Tag substituindo o gráfico do card anterior para manter o peso visual */}
        <div className="flex items-center">
          <span className="text-[9px] font-black text-white bg-black border-2 border-black px-2 py-1.5 rounded shadow-[2px_2px_0px_0px_#000000] uppercase tracking-widest">
            PROJEÇÃO
          </span>
        </div>
      </div>
    </div>
  );
}
