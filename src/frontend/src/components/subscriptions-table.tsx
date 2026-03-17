import React, { useState } from "react";
import { Pencil, Trash2, FileX } from "lucide-react";

// 1. Interface TypeScript
export type CommitmentType = "subscription" | "installment";
export type CommitmentStatus = "active" | "finished";

export interface SubscriptionItem {
  id: string;
  name: string;
  type: CommitmentType;
  value: number;
  recurrence?: string; // Ex: "Mensal", "Anual" (Para assinaturas)
  installmentCurrent?: number; // (Para parcelamentos)
  installmentTotal?: number; // (Para parcelamentos)
  nextBilling: string;
  totalPaid: number;
  status: CommitmentStatus;
}

// 2. Mock de dados
const mockData: SubscriptionItem[] = [
  {
    id: "1",
    name: "Netflix",
    type: "subscription",
    value: 39.9,
    recurrence: "Mensal",
    nextBilling: "18 Mar",
    totalPaid: 480,
    status: "active",
  },
  {
    id: "2",
    name: "Notebook Dell",
    type: "installment",
    value: 320,
    installmentCurrent: 3,
    installmentTotal: 12,
    nextBilling: "18 Mar",
    totalPaid: 960,
    status: "active",
  },
  {
    id: "3",
    name: "Academia SmartFit",
    type: "subscription",
    value: 119.9,
    recurrence: "Mensal",
    nextBilling: "22 Mar",
    totalPaid: 1438.8,
    status: "active",
  },
  {
    id: "4",
    name: "Amazon Prime",
    type: "subscription",
    value: 119.0,
    recurrence: "Anual",
    nextBilling: "05 Nov",
    totalPaid: 238,
    status: "active",
  },
  {
    id: "5",
    name: "iPhone 13",
    type: "installment",
    value: 450,
    installmentCurrent: 12,
    installmentTotal: 12,
    nextBilling: "-",
    totalPaid: 5400,
    status: "finished",
  },
];

// Tipagem para os filtros
type FilterType = "all" | CommitmentType;

export default function SubscriptionTable() {
  const [filter, setFilter] = useState<FilterType>("all");

  // Formatação de Moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Filtragem dos dados
  const filteredData = mockData.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="w-full bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* HEADER & FILTROS */}
      <div className="p-5 sm:p-6 border-b-2 border-[var(--black)] bg-[var(--main-bg)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--primary)] uppercase tracking-tighter">
            Compromissos recorrentes
          </h2>
          <p className="text-[10px] sm:text-xs font-bold text-[var(--black-muted)] uppercase tracking-widest mt-1">
            Assinaturas e parcelamentos ativos
          </p>
        </div>

        {/* Filtros em formato de Pílula Brutalista */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-lg border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-md transition-all border-2 ${
              filter === "all"
                ? "bg-[var(--primary)] text-[var(--secondary)] border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                : "bg-transparent text-[var(--black-muted)] border-transparent hover:text-[var(--primary)] hover:bg-black/5"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("subscription")}
            className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-md transition-all border-2 ${
              filter === "subscription"
                ? "bg-[var(--primary)] text-white border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                : "bg-transparent text-[var(--black-muted)] border-transparent hover:text-[var(--primary)] hover:bg-black/5"
            }`}
          >
            Assinaturas
          </button>
          <button
            onClick={() => setFilter("installment")}
            className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-md transition-all border-2 ${
              filter === "installment"
                ? "bg-[var(--secondary)] text-[var(--primary)] border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                : "bg-transparent text-[var(--black-muted)] border-transparent hover:text-[var(--primary)] hover:bg-black/5"
            }`}
          >
            Parcelamentos
          </button>
        </div>
      </div>

      {/* ÁREA DA TABELA */}
      <div className="overflow-x-auto w-full min-h-[300px]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-white border-b-2 border-[var(--black)]">
              <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">
                Nome
              </th>
              <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">
                Tipo
              </th>
              <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">
                Valor
              </th>
              <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">
                Recorrência / Parcela
              </th>
              <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">
                Próxima cobrança
              </th>
              <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest text-right">
                Total pago
              </th>
              <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest text-center">
                Status
              </th>
              <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-full shadow-[var(--neo-shadow)]">
                      <FileX
                        size={32}
                        strokeWidth={2}
                        className="text-[var(--black-muted)]"
                      />
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
                  key={item.id}
                  className="border-b-2 border-[var(--black)] transition-colors hover:bg-black/5"
                >
                  {/* Nome */}
                  <td className="p-4 sm:p-5">
                    <span className="text-sm font-black text-[var(--primary)] uppercase tracking-tight">
                      {item.name}
                    </span>
                  </td>

                  {/* Tipo (Badge Azul ou Amarelo) */}
                  <td className="p-4 sm:p-5">
                    <span
                      className={`text-[9px] font-black px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-sm uppercase tracking-wider ${
                        item.type === "subscription"
                          ? "bg-[var(--primary)] text-[var(--main-bg)]"
                          : "bg-[var(--secondary)] text-[var(--primary)]"
                      }`}
                    >
                      {item.type === "subscription"
                        ? "Assinatura"
                        : "Parcelamento"}
                    </span>
                  </td>

                  {/* Valor */}
                  <td className="p-4 sm:p-5">
                    <span className="text-sm font-black text-[var(--primary)]">
                      {formatCurrency(item.value)}
                    </span>
                  </td>

                  {/* Recorrência / Parcela */}
                  <td className="p-4 sm:p-5">
                    <span className="text-xs font-bold text-[var(--black-muted)] uppercase tracking-wider">
                      {item.type === "subscription"
                        ? item.recurrence
                        : `${item.installmentCurrent} / ${item.installmentTotal} parcelas`}
                    </span>
                  </td>

                  {/* Próxima cobrança */}
                  <td className="p-4 sm:p-5">
                    <span className="text-xs font-bold text-[var(--black-muted)]">
                      {item.nextBilling}
                    </span>
                  </td>

                  {/* Total pago */}
                  <td className="p-4 sm:p-5 text-right">
                    <span className="text-sm font-black text-[var(--black-light)]">
                      {formatCurrency(item.totalPaid)}
                    </span>
                  </td>

                  {/* Status (Ativo ou Finalizado) */}
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

                  {/* Ações */}
                  <td className="p-4 sm:p-5">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white transition-all hover:shadow-[var(--neo-shadow-hover)] text-[var(--black-light)] hover:text-[var(--primary)]">
                        <Pencil size={16} strokeWidth={2.5} />
                      </button>
                      <button className="p-1.5 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white transition-all hover:shadow-[var(--neo-shadow-hover)] text-[var(--black-light)] hover:text-red-500">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
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
