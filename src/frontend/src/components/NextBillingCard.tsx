
// 1. Interface de tipos para os dados
interface NextBillingData {
  name: string;
  value: number;
  nextBillingDate: string;
  installment?: {
    current: number;
    total: number;
  };
  totalPaid: number;
  isSubscription: boolean;
}

// 2. Mock de dados
const mockData: NextBillingData = {
  name: "Notebook Dell",
  value: 320,
  nextBillingDate: "18 Mar",
  installment: {
    current: 3,
    total: 12,
  },
  totalPaid: 960,
  isSubscription: false,
};

// Utilitário para formatar valores em Real brasileiro
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// 3. Componente Principal
export default function NextBillingCard() {
  return (
    <div className="flex flex-col w-full h-full p-6 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* Topo: Título do card com opacidade para dar hierarquia */}
      <h2 className="text-xs font-black text-[var(--main-bg)] opacity-80 uppercase tracking-widest mb-4">
        Próxima cobrança
      </h2>

      {/* Centro: Nome e Valor destacado */}
      <div className="flex-grow flex flex-col justify-center mb-6 mt-2">
        <p className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-widest mb-1.5 truncate">
          {mockData.name}
        </p>
        <span className="text-4xl md:text-5xl font-black text-[var(--secondary)] tracking-tighter">
          {formatCurrency(mockData.value)}
        </span>
      </div>

      {/* Parte inferior: Informações secundárias */}
      <div className="flex flex-col gap-3 mt-auto pt-4 border-t-2 border-white/30 border-dashed">
        {/* Data da cobrança com destaque de "Etiqueta" Neo-brutalista */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-wider">
            Data:
          </span>
          <span className="text-[10px] font-black text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] uppercase tracking-wider">
            {mockData.nextBillingDate}
          </span>
        </div>

        {/* Tipo de recorrência ou parcelas */}
        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-wider">
            Tipo:
          </span>
          <span className="text-xs font-bold text-[var(--main-bg)] tracking-tight">
            {mockData.isSubscription
              ? "Recorrente mensal"
              : `${mockData.installment?.current} / ${mockData.installment?.total} parcelas`}
          </span>
        </div>

        {/* Total pago */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-wider">
            Total pago:
          </span>
          <span className="text-xs font-bold text-[var(--main-bg)] tracking-tight">
            {formatCurrency(mockData.totalPaid)}
          </span>
        </div>
      </div>
    </div>
  );
}
