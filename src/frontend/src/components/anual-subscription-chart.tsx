import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 1. Interface tipada para os dados
interface MonthlyCommitment {
  month: string;
  subscriptions: number;
  installments: number;
}

// 2. Dados mockados
const mockData: MonthlyCommitment[] = [
  { month: "Mar", subscriptions: 280, installments: 500 },
  { month: "Abr", subscriptions: 280, installments: 500 },
  { month: "Mai", subscriptions: 280, installments: 500 },
  { month: "Jun", subscriptions: 280, installments: 370 },
  { month: "Jul", subscriptions: 310, installments: 370 },
  { month: "Ago", subscriptions: 310, installments: 150 },
  { month: "Set", subscriptions: 310, installments: 150 },
  { month: "Out", subscriptions: 380, installments: 150 },
  { month: "Nov", subscriptions: 380, installments: 0 },
  { month: "Dez", subscriptions: 380, installments: 0 },
  { month: "Jan", subscriptions: 280, installments: 0 },
  { month: "Fev", subscriptions: 280, installments: 0 },
];

// Tipagem para o estado do filtro
type FilterType = "all" | "subscriptions" | "installments";

const COLORS = {
  subscriptions: "var(--primary)",
  installments: "var(--secondary)",
};

export default function AnnualSubscriptionChart() {
  const [filter, setFilter] = useState<FilterType>("all");

  // Função utilitária para formatação
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
      };

      // Soma o total apenas dos itens visíveis no payload
      const total = payload.reduce(
        (sum: number, entry: any) => sum + entry.value,
        0,
      );

      return (
        <div className="bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 min-w-[180px]">
          <p className="text-[10px] font-black uppercase text-[var(--black-muted)] mb-2 border-b-2 border-[var(--black)] border-dashed pb-1">
            {label}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center gap-4"
              >
                <span className="text-[10px] font-bold uppercase text-[var(--black-muted)]">
                  {entry.name === "subscriptions" ? "Assinaturas" : "Parcelas"}:
                </span>
                <span className="text-xs font-black text-[var(--primary)]">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>

          {/* Linha do Total */}
          <div className="mt-2 pt-2 border-t-2 border-[var(--black)] flex justify-between items-center bg-[var(--secondary)] -mx-3 -mb-3 px-3 py-2 rounded-b-md">
            <span className="text-[10px] font-black uppercase text-[var(--primary)]">
              Total:
            </span>
            <span className="text-sm font-black text-[var(--primary)]">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-5 sm:p-6 w-full h-full shadow-[var(--neo-shadow)] flex flex-col transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* HEADER E FILTROS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--primary)] uppercase tracking-tighter">
            Projeção de compromissos
          </h2>
          <p className="text-[10px] sm:text-xs font-bold text-[var(--black-muted)] uppercase tracking-widest mt-1">
            Gastos recorrentes nos próximos 12 meses
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-[var(--main-bg)] p-1.5 rounded-lg border-2 border-[var(--black)]">
          {(["all", "subscriptions", "installments"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-md transition-all border-2 ${
                filter === type
                  ? "bg-[var(--primary)] text-[var(--secondary)] border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                  : "bg-transparent text-[var(--black-muted)] border-transparent hover:text-[var(--primary)] hover:bg-black/5"
              }`}
            >
              {type === "all"
                ? "Todos"
                : type === "subscriptions"
                  ? "Assinaturas"
                  : "Parcelamentos"}
            </button>
          ))}
        </div>
      </div>

      {/* GRÁFICO DE ÁREA */}
      <div className="w-full h-[300px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--black)"
              strokeOpacity={0.15}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={{ stroke: "var(--black)", strokeWidth: 2 }}
              tickLine={{ stroke: "var(--black)", strokeWidth: 2 }}
              tick={{
                fill: "var(--black-muted)",
                fontSize: 11,
                fontWeight: "900",
              }}
              dy={10}
            />
            <YAxis
              tickFormatter={(val) => `R$ ${val}`}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--black-muted)",
                fontSize: 11,
                fontWeight: "bold",
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--black)",
                strokeWidth: 2,
                strokeDasharray: "4 4",
                opacity: 0.5,
              }}
            />

            {(filter === "all" || filter === "subscriptions") && (
              <Area
                type="linear"
                dataKey="subscriptions"
                name="subscriptions"
                stackId="1"
                stroke="var(--black)"
                strokeWidth={3}
                fill={COLORS.subscriptions}
                fillOpacity={0.9}
              />
            )}

            {(filter === "all" || filter === "installments") && (
              <Area
                type="linear"
                dataKey="installments"
                name="installments"
                stackId="1"
                stroke="var(--black)"
                strokeWidth={3}
                fill={COLORS.installments}
                fillOpacity={0.9}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* LEGENDA */}
      <div className="flex flex-wrap justify-center gap-6 mt-6 pt-4 border-t-2 border-[var(--black)] border-dashed">
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
            style={{ backgroundColor: COLORS.subscriptions }}
          />
          <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">
            Assinaturas
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
            style={{ backgroundColor: COLORS.installments }}
          />
          <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">
            Parcelamentos
          </span>
        </div>
      </div>
    </div>
  );
}
