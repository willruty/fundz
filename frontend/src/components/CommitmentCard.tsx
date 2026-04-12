interface CommitmentCardProps {
  averageMonthlyCommitment: number;
  parcelmentsPct: number;
  subscriptionsPct: number;
  subscriptionsAmount: number;
  parcelmentsAmount: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default function CommitmentCard({
  averageMonthlyCommitment,
  parcelmentsPct,
  subscriptionsPct,
  subscriptionsAmount,
  parcelmentsAmount,
}: CommitmentCardProps) {
  return (
    <div className="flex flex-col justify-between w-full h-full bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      <div className="flex flex-col h-full px-6 py-6">
        <h2 className="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-1">
          Compromissos financeiros
        </h2>
        <p className="text-[10px] font-bold text-[var(--primary)] opacity-50 uppercase tracking-wider">
          Gastos fixos mensais
        </p>

        <div className="my-5 flex-grow flex flex-col justify-center">
          <span className="text-4xl md:text-5xl font-black text-[var(--primary)] tracking-tighter leading-none">
            {formatCurrency(averageMonthlyCommitment)}
          </span>
          <span className="text-xs font-bold text-[var(--primary)] opacity-60 mt-1">por mês</span>
        </div>

        {/* Barra de proporção */}
        <div className="mb-4">
          <div className="w-full h-3 border-2 border-[var(--black)] rounded-sm overflow-hidden flex">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-700"
              style={{ width: `${subscriptionsPct}%` }}
            />
            <div
              className="h-full bg-[#FF3B3B] transition-all duration-700"
              style={{ width: `${parcelmentsPct}%` }}
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)]">
            <div className="w-3 h-8 bg-[var(--primary)] border-2 border-[var(--black)] rounded-sm shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider">
                Assinaturas
              </span>
              <span className="text-base font-black text-[var(--primary)] tracking-tight leading-tight">
                {formatCurrency(subscriptionsAmount)}
              </span>
              <span className="text-[9px] font-bold text-[var(--black-muted)]">
                {subscriptionsPct}% do total
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)]">
            <div className="w-3 h-8 bg-[#FF3B3B] border-2 border-[var(--black)] rounded-sm shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider">
                Parcelas
              </span>
              <span className="text-base font-black text-[var(--primary)] tracking-tight leading-tight">
                {formatCurrency(parcelmentsAmount)}
              </span>
              <span className="text-[9px] font-bold text-[var(--black-muted)]">
                {parcelmentsPct}% do total
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
