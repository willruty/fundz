interface Transaction {
  id: number;
  title: string;
  category: string;
  date: string;
  amount: number;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    title: "Compra de passagens aéreas",
    category: "Viagem",
    date: "15/10/2023",
    amount: 1250.75,
  },
  {
    id: 2,
    title: "Supermercado Extra",
    category: "Alimentação",
    date: "12/10/2023",
    amount: 450.0,
  },
  {
    id: 3,
    title: "Uber p/ Reunião",
    category: "Transporte",
    date: "11/10/2023",
    amount: 35.5,
  },
  {
    id: 4,
    title: "Energético",
    category: "Vícios",
    date: "10/10/2023",
    amount: 12.5,
  },
  {
    id: 5,
    title: "Mensalidade Academia",
    category: "Saúde",
    date: "05/10/2023",
    amount: 110.0,
  },
];

export function TransactionTableCard() {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="flex flex-col bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_#000000] overflow-hidden">
      {/* Topo do Card com Botão de "Create" */}
      <div className="p-6 border-b-[3px] border-black flex justify-between items-center bg-white">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tighter uppercase m-0 leading-none">
            Transações
          </h2>
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mt-1 block">
            Histórico Completo
          </span>
        </div>

        {/* Botão Brutalista de Adicionar */}
        <button className="bg-[#FF3B3B] text-white font-black px-4 py-2 border-[3px] border-black rounded-lg shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000] transition-all uppercase text-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
          + Nova Despesa
        </button>
      </div>

      {/* Container da Tabela (com overflow-x para mobile se necessário) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          {/* Cabeçalho da Tabela Sólido em Azul */}
          <thead className="bg-[#08233e] text-white">
            <tr>
              <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-[3px] border-black w-2/5">
                Título
              </th>
              <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-[3px] border-black">
                Categoria
              </th>
              <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-[3px] border-black">
                Data
              </th>
              <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-[3px] border-black text-right">
                Valor
              </th>
              <th className="p-4 text-[11px] font-black uppercase tracking-widest border-b-[3px] border-black text-center">
                Ações
              </th>
            </tr>
          </thead>

          {/* Corpo da Tabela com Hover Suave */}
          <tbody>
            {mockTransactions.map((t) => (
              <tr
                key={t.id}
                className="border-b-[2px] border-gray-200 hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="p-4 text-sm font-bold text-black truncate">
                  {t.title}
                </td>
                <td className="p-4">
                  {/* Etiqueta de Categoria */}
                  <span className="text-[10px] font-black bg-white border-2 border-black px-2 py-1 rounded shadow-[2px_2px_0px_0px_#000000] uppercase tracking-wider">
                    {t.category}
                  </span>
                </td>
                <td className="p-4 text-xs font-bold text-gray-500 tracking-wider">
                  {t.date}
                </td>
                <td className="p-4 text-base font-black text-[#FF3B3B] text-right">
                  {formatCurrency(t.amount)}
                </td>
                <td className="p-4">
                  {/* Botões de Ação (Update / Delete) */}
                  <div className="flex justify-center gap-2">
                    <button className="text-[10px] font-black bg-[#ffd100] border-2 border-black px-2 py-1 rounded shadow-[2px_2px_0px_0px_#000000] hover:bg-[#e6bc00] transition-colors uppercase active:translate-y-[2px] active:shadow-none">
                      Editar
                    </button>
                    <button className="text-[10px] font-black bg-white text-black border-2 border-black px-2 py-1 rounded shadow-[2px_2px_0px_0px_#000000] hover:bg-gray-100 transition-colors uppercase active:translate-y-[2px] active:shadow-none">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
