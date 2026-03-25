export function MonthlyForecastCard({
  dailyAverage = 142.5,
  daysInMonth = 30,
}) {
  // Lógica de projeção baseada no gasto diário
  const forecastedAmount = dailyAverage * daysInMonth;

  return (
    <div className="flex flex-col justify-center p-6 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000] transition-all duration-200 cursor-default">
      {/* Cabeçalho do Card */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-extrabold tracking-wider text-[#08233e] uppercase">
          Previsão Mensal
        </span>
        {/* Tag explicativa neo-brutalista */}
        <span className="text-[9px] font-bold bg-gray-100 text-black px-2 py-1 rounded border border-black uppercase">
          Projeção
        </span>
      </div>

      {/* Valor da Previsão */}
      <h2 className="text-3xl font-black text-black m-0">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(forecastedAmount)}
      </h2>

      {/* Contexto do cálculo */}
      <span className="text-xs font-bold text-gray-500 mt-2">
        Baseado na média de R$ {dailyAverage.toFixed(2).replace(".", ",")} / dia
      </span>
    </div>
  );
}
