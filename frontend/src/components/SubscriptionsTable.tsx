import { useState } from "react";
import { Pencil, Trash2, FileX, Plus } from "lucide-react";

export type CommitmentType = "subscription" | "installment";
export type CommitmentStatus = "active" | "finished";

export interface SubscriptionItem {
  id: string;
  name: string;
  type: CommitmentType;
  value: number;
  recurrence?: string;
  installmentCurrent?: number;
  installmentTotal?: number;
  nextBilling: string;
  totalPaid: number;
  status: CommitmentStatus;
}

interface SubscriptionTableProps {
  items: SubscriptionItem[];
  onNew: () => void;
  onEdit: (item: SubscriptionItem) => void;
  onDelete: (item: SubscriptionItem) => void;
  isGuest?: boolean;
}

type FilterType = "all" | CommitmentType;

export default function SubscriptionTable({ items, onNew, onEdit, onDelete, isGuest }: SubscriptionTableProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const filteredData = items.filter((item) =>
    filter === "all" ? true : item.type === filter
  );

  return (
    <div className="w-full bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">

      <div className="p-5 sm:p-6 border-b-2 border-[var(--black)] bg-[var(--primary)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--secondary)] uppercase tracking-tighter italic">
            Compromissos Recorrentes
          </h2>
          <p className="text-[10px] font-bold text-[var(--main-bg)] opacity-70 uppercase tracking-widest mt-1">
            Assinaturas e parcelamentos ativos
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[var(--main-bg)] p-1.5 rounded-lg border-2 border-[var(--black)]">
            {([
              { key: "all",          label: "Todos"          },
              { key: "subscription", label: "Assinaturas"    },
              { key: "installment",  label: "Parcelamentos"  },
            ] as { key: FilterType; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-md transition-all border-2 cursor-pointer ${
                  filter === key
                    ? key === "installment"
                      ? "bg-[var(--secondary)] text-[var(--primary)] border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                      : "bg-[var(--primary)] text-[var(--secondary)] border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                    : "bg-transparent text-[var(--black-muted)] border-transparent hover:text-[var(--primary)] hover:bg-black/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {!isGuest && (
            <button
              onClick={onNew}
              className="bg-[var(--secondary)] text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 hover:bg-[var(--secondary-hover)] transition-all shadow-[var(--neo-shadow-hover)] cursor-pointer"
            >
              <Plus size={14} strokeWidth={3} /> Novo
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto w-full min-h-[300px]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-white border-b-2 border-[var(--black)]">
              {["Nome", "Tipo", "Valor", "Recorrência / Parcela", "Próxima cobrança", "Total pago", "Status", "Ações"].map((h, i) => (
                <th
                  key={h}
                  className={`p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest ${i >= 5 ? "text-right" : ""} ${h === "Status" || h === "Ações" ? "text-center" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-full shadow-[var(--neo-shadow)]">
                      <FileX size={32} strokeWidth={2} className="text-[var(--black-muted)]" />
                    </div>
                    <p className="text-sm font-black text-[var(--primary)] uppercase tracking-wider">
                      Nenhum compromisso encontrado
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr
                  key={`${item.type}-${item.id}`}
                  className="border-b-2 border-[var(--black)] transition-all group hover:bg-[var(--secondary)] hover:bg-opacity-10"
                >
                  <td className="p-4 sm:p-5 relative">
                    <div className="absolute left-0 top-0 h-full w-1 bg-[var(--secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-black text-[var(--primary)] uppercase tracking-tight">
                      {item.name}
                    </span>
                  </td>

                  <td className="p-4 sm:p-5">
                    <span
                      className={`text-[9px] font-black px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] uppercase tracking-wider ${
                        item.type === "subscription"
                          ? "bg-[var(--primary)] text-[var(--main-bg)]"
                          : "bg-[var(--secondary)] text-[var(--primary)]"
                      }`}
                    >
                      {item.type === "subscription" ? "Assinatura" : "Parcelamento"}
                    </span>
                  </td>

                  <td className="p-4 sm:p-5">
                    <span className="text-sm font-black text-[var(--primary)]">{fmt(item.value)}</span>
                  </td>

                  <td className="p-4 sm:p-5">
                    <span className="text-xs font-bold text-[var(--black-muted)] uppercase tracking-wider">
                      {item.type === "subscription"
                        ? item.recurrence
                        : `${item.installmentCurrent} / ${item.installmentTotal} parcelas`}
                    </span>
                  </td>

                  <td className="p-4 sm:p-5">
                    <span className="text-xs font-bold text-[var(--black-muted)]">
                      {item.nextBilling}
                    </span>
                  </td>

                  <td className="p-4 sm:p-5 text-right">
                    <span className="text-sm font-black text-[var(--black-light)]">
                      {fmt(item.totalPaid)}
                    </span>
                  </td>

                  <td className="p-4 sm:p-5 text-center">
                    <span
                      className={`text-[9px] font-black px-2.5 py-1 rounded-md border-2 border-[var(--black)] uppercase tracking-wider ${
                        item.status === "active"
                          ? "bg-emerald-400 text-[var(--primary)]"
                          : "bg-gray-200 text-[var(--black-muted)]"
                      }`}
                    >
                      {item.status === "active" ? "Ativo" : "Finalizado"}
                    </span>
                  </td>

                  <td className="p-4 sm:p-5">
                    <div className="flex justify-center gap-2">
                      {!isGuest && (
                        <>
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white transition-all hover:shadow-[var(--neo-shadow-hover)] text-[var(--black-light)] hover:text-[var(--primary)] cursor-pointer"
                          >
                            <Pencil size={16} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => onDelete(item)}
                            className="p-1.5 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white transition-all hover:shadow-[var(--neo-shadow-hover)] text-[var(--black-light)] hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
