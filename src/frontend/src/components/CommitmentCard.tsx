
// 1. Interface de tipos para os dados
interface CommitmentData {
  averageMonthlyCommitment: number;
  breakdown: {
    parcelments: number;
    subscriptions: number;
  };
}

// 2. Mock de dados
const mockData: CommitmentData = {
  averageMonthlyCommitment: 780,
  breakdown: {
    parcelments: 42,
    subscriptions: 58,
  },
};

// Utilitário para formatar valores em Real brasileiro
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// 3. Componente Principal
export default function CommitmentCard() {
  return (
    <div className="flex flex-col justify-between w-full h-full p-0 m-0 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* Wrapper interno para dar respiro, já que a raiz não tem padding/margin */}
      <div className="flex flex-col h-full px-6 py-6">
        {/* Topo: Título do Card */}
        <div className="mb-6">
          <h2 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">
            Compromissos financeiros
          </h2>
        </div>

        {/* Centro: Métrica principal destacada */}
        <div className="mb-8 flex-grow flex flex-col justify-center">
          <p className="text-xs font-black text-[var(--primary)] opacity-70 mb-1 uppercase tracking-widest">
            Média mensal
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-black text-[var(--primary)] tracking-tighter">
              {formatCurrency(mockData.averageMonthlyCommitment)}
            </span>
            <span className="text-lg font-bold text-[var(--primary)] opacity-80">
              / mês
            </span>
          </div>
        </div>

        {/* Parte inferior: Breakdown em duas colunas com fundos brancos */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          {/* Coluna 1: Parcelamentos */}
          <div className="flex flex-col p-4 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)] hover:bg-black/5 transition-colors cursor-default">
            <span className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-1">
              Parcelamentos
            </span>
            <span className="text-2xl font-black text-[var(--primary)]">
              {mockData.breakdown.parcelments}%
            </span>
          </div>

          {/* Coluna 2: Assinaturas */}
          <div className="flex flex-col p-4 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)] hover:bg-black/5 transition-colors cursor-default">
            <span className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-1">
              Assinaturas
            </span>
            <span className="text-2xl font-black text-[var(--primary)]">
              {mockData.breakdown.subscriptions}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
