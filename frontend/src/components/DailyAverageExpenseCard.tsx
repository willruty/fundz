import { TrendingUp, TrendingDown } from "lucide-react";

// 1. Interface tipada para os dados
interface DailyAverageExpenseData {
  averageDaily: number;
  comparison: {
    value: number;
    isIncreased: boolean; // Renomeado para ficar mais claro em relação a despesas
  };
}

// 2. Mock de dados
const mockData: DailyAverageExpenseData = {
  averageDaily: 62.4,
  comparison: {
    value: 12,
    isIncreased: true, // Gasto aumentou 12%
  },
};

// Utilitário para formatar moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default function DailyAverageExpenseCard() {
  const { averageDaily, comparison } = mockData;

  // Lógica de cores baseada na natureza da métrica (Despesa)
  // Aumento de despesa = Vermelho (Ruim) | Queda de despesa = Verde (Bom)
  const badgeColor = comparison.isIncreased
    ? "bg-red-400 text-white"
    : "bg-emerald-400 text-[var(--primary)]";

  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-5 sm:p-6 w-full h-full shadow-[var(--neo-shadow)] flex flex-col justify-between transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* HEADER */}
      <div className="flex flex-col mb-4">
        <h3 className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">
          Média diária
        </h3>
      </div>

      {/* CORPO: Valor Principal */}
      <div className="flex flex-col justify-center flex-grow mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-black text-red-500 tracking-tighter drop-shadow-sm">
            {formatCurrency(averageDaily)}
          </span>
          <span className="text-sm font-black text-[var(--black-muted)] uppercase tracking-widest">
            / dia
          </span>
        </div>
        <p className="text-[10px] font-bold text-[var(--black-light)] uppercase tracking-wider mt-1">
          Baseado nos gastos do mês atual
        </p>
      </div>

      {/* RODAPÉ: Comparação */}
      <div className="pt-4 border-t-2 border-[var(--black)] border-dashed mt-auto">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] text-[10px] font-black uppercase tracking-wider ${badgeColor}`}
          >
            {comparison.isIncreased ? (
              <TrendingUp size={14} strokeWidth={3} />
            ) : (
              <TrendingDown size={14} strokeWidth={3} />
            )}
            {comparison.isIncreased ? "+" : "-"}
            {comparison.value}%
          </div>
          <span className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider">
            vs. mês passado
          </span>
        </div>
      </div>
    </div>
  );
}
