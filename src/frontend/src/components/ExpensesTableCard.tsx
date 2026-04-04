import { useState } from "react";
import { Plus, Pencil, Trash2, FileX } from "lucide-react";

interface Transaction {
  id: number;
  title: string;
  category: string;
  date: string;
  amount: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Viagem:      "#1A6BFF",
  Alimentação: "#22c55e",
  Transporte:  "#f97316",
  Vícios:      "#FF3B3B",
  Saúde:       "#a855f7",
};

const mockTransactions: Transaction[] = [
  { id: 1, title: "Compra de passagens aéreas", category: "Viagem",      date: "15/10/2023", amount: 1250.75 },
  { id: 2, title: "Supermercado Extra",          category: "Alimentação", date: "12/10/2023", amount: 450.00  },
  { id: 3, title: "Uber p/ Reunião",             category: "Transporte",  date: "11/10/2023", amount: 35.50   },
  { id: 4, title: "Energético",                  category: "Vícios",      date: "10/10/2023", amount: 12.50   },
  { id: 5, title: "Mensalidade Academia",        category: "Saúde",       date: "05/10/2023", amount: 110.00  },
];

export function TransactionTableCard() {
  const [selected, setSelected] = useState<number | null>(null);

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const total = mockTransactions.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200">

      {/* HEADER — primary, mesmo padrão do RecentTransactions */}
      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-extrabold tracking-widest text-[#FF3B3B] uppercase mb-1">
            Despesas
          </h3>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter m-0">
            Transações do Mês
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-[var(--main-bg)] opacity-60 uppercase tracking-wider">Total gasto</span>
            <span className="text-lg font-black text-[#FF3B3B] tracking-tight">{fmt(total)}</span>
          </div>
          <button className="bg-[var(--secondary)] text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 hover:bg-[var(--secondary-hover)] shadow-[var(--neo-shadow-hover)] transition-all cursor-pointer">
            <Plus size={14} strokeWidth={3} /> Nova
          </button>
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--black)] bg-white">
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest w-10" />
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Data</th>
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Descrição</th>
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Categoria</th>
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest text-right">Valor</th>
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {mockTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-full shadow-[var(--neo-shadow)]">
                      <FileX size={32} strokeWidth={2} className="text-[var(--black-muted)]" />
                    </div>
                    <p className="text-sm font-black text-[var(--primary)] uppercase tracking-wider">
                      Nenhuma transação
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              mockTransactions.map((t) => {
                const catColor = CATEGORY_COLORS[t.category] ?? "var(--primary)";
                const isSelected = selected === t.id;
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelected(isSelected ? null : t.id)}
                    className={`border-b-2 border-[var(--black)] transition-all cursor-pointer group ${
                      isSelected ? "bg-[var(--secondary)] bg-opacity-20" : "hover:bg-black/[0.03]"
                    }`}
                  >
                    {/* Faixa colorida lateral */}
                    <td className="p-4 w-2 relative">
                      <div
                        className="absolute left-0 top-0 h-full w-1.5 transition-opacity"
                        style={{ background: catColor, opacity: isSelected ? 1 : 0 }}
                      />
                      <div
                        className="w-1.5 h-full absolute left-0 top-0 group-hover:opacity-60 opacity-0 transition-opacity"
                        style={{ background: catColor }}
                      />
                    </td>

                    <td className="p-4 text-xs font-bold text-[var(--black-muted)] whitespace-nowrap">
                      {t.date}
                    </td>

                    <td className="p-4">
                      <span className="text-sm font-black text-[var(--primary)] uppercase tracking-tight">
                        {t.title}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className="text-[9px] font-black px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] uppercase tracking-wider text-white"
                        style={{ background: catColor }}
                      >
                        {t.category}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <span className="text-sm font-black text-[#FF3B3B] px-2 py-1 rounded border-2 border-[var(--black)] bg-red-50">
                        {fmt(t.amount)}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white transition-all hover:shadow-[var(--neo-shadow-hover)] text-[var(--black-light)] hover:text-[var(--primary)] cursor-pointer"
                        >
                          <Pencil size={15} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white transition-all hover:shadow-[var(--neo-shadow-hover)] text-[var(--black-light)] hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 size={15} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* RODAPÉ */}
      <div className="px-6 py-4 bg-white border-t-2 border-[var(--black)] border-dashed flex justify-between items-center">
        <span className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider">
          {mockTransactions.length} transações
        </span>
        <span className="text-[10px] font-black text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] uppercase tracking-wider">
          {fmt(total)} total
        </span>
      </div>
    </div>
  );
}
