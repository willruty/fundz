interface NextBillingCardProps {
  name: string;
  value: number;
  nextBillingDate: string;
  billingCycle: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function fmtDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function fmtCycle(cycle: string): string {
  if (cycle === "monthly") return "Recorrente mensal";
  if (cycle === "yearly")  return "Recorrente anual";
  return cycle;
}

export default function NextBillingCard({
  name,
  value,
  nextBillingDate,
  billingCycle,
}: NextBillingCardProps) {
  return (
    <div className="flex flex-col w-full h-full p-6 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      <h2 className="text-xs font-black text-[var(--main-bg)] opacity-80 uppercase tracking-widest mb-4">
        Próxima cobrança
      </h2>

      <div className="flex-grow flex flex-col justify-center mb-6 mt-2">
        <p className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-widest mb-1.5 truncate">
          {name}
        </p>
        <span className="text-4xl md:text-5xl font-black text-[var(--secondary)] tracking-tighter">
          {formatCurrency(value)}
        </span>
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-4 border-t-2 border-white/30 border-dashed">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-wider">
            Data:
          </span>
          <span className="text-[10px] font-black text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] uppercase tracking-wider">
            {fmtDate(nextBillingDate)}
          </span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-wider">
            Tipo:
          </span>
          <span className="text-xs font-bold text-[var(--main-bg)] tracking-tight">
            {fmtCycle(billingCycle)}
          </span>
        </div>
      </div>
    </div>
  );
}
