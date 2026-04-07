
export function HighestExpenseCard({
  amount = 1250.75,
  date = "15/10/2023",
  category = "Viagem",
  description = "Compra de passagens aéreas e reserva de hotel para viagem a trabalho.",
}) {
  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

  return (
    <div className="flex flex-col bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_#000000] overflow-hidden hover:bg-gray-50 transition-colors duration-200 cursor-default h-full">
      {/* Cabeçalho Azul com a Data integrada */}
      <div className="bg-[#08233e] border-b-[3px] border-black px-5 py-3 flex justify-between items-center hover:bg-[#061a2e] transition-colors">
        <span className="text-xs font-black tracking-widest text-white uppercase">
          Maior Gasto do Mês
        </span>
        <span className="text-[10px] font-black text-black bg-white px-2 py-0.5 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000]">
          {date}
        </span>
      </div>

      {/* Corpo do Card: Nova Ordem (Contexto -> Valor) */}
      <div className="flex flex-col p-6 flex-1 justify-between">
        {/* Bloco Superior: Categoria e Descrição ganham destaque narrativo */}
        <div>
          <span className="inline-block text-[10px] font-black text-white bg-[#FF3B3B] border-2 border-black px-2 py-1 rounded shadow-[2px_2px_0px_0px_#000000] uppercase tracking-widest mb-3">
            {category}
          </span>
          <p className="text-sm font-bold text-gray-800 m-0 line-clamp-3 leading-relaxed">
            "{description}"
          </p>
        </div>

        {/* Rodapé: Valor Gigante ancorado por uma linha tracejada */}
        <div className="mt-6 border-t-[4px] border-black border-dotted pt-4 flex flex-col items-end">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">
            Total da Transação
          </span>
          <h2 className="text-5xl font-black text-black m-0 tracking-tighter">
            {formattedAmount}
          </h2>
        </div>
      </div>
    </div>
  );
}
