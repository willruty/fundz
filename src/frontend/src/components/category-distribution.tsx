import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { CategoryDistribution } from "../types/dashboard";

const COLORS = [
  "#08233e", // --primary
  "#ffd100", // --secondary
  "#0c3156", // --primary-hover
  "#9ca3af", // gray-400
  "#000000", // --black
];

type Props = {
  distribution: CategoryDistribution[];
};

export function CategoryDistributionCard({ distribution = [] }: Props) {
  const hasData = distribution && distribution.length > 0;
  const topCategory = hasData ? distribution[0].name : "N/A";
  const bottomCategory = hasData
    ? distribution[distribution.length - 1].name
    : "N/A";

  return (
    // Padding reduzido para p-4 (sm:p-5) e remoção do min-h-[280px]
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-4 sm:p-5 w-full h-full shadow-[var(--neo-shadow)] relative flex flex-col justify-between transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* Cabeçalho com margem inferior reduzida (mb-3) */}
      <header className="flex justify-between items-start sm:items-center relative z-10 mb-3">
        <div className="flex flex-col">
          <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest mb-1.5">
            Distribuição
          </span>
          {/* Badges levemente menores */}
          <div className="flex flex-wrap gap-2 mt-0.5">
            <div className="flex items-center gap-1 px-1.5 py-0.5 border-2 border-[var(--black)] rounded-md bg-emerald-400 text-[9px] font-black text-[var(--primary)] uppercase shadow-[var(--neo-shadow-hover)]">
              <TrendingUp size={10} strokeWidth={3} /> {topCategory}
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 border-2 border-[var(--black)] rounded-md bg-red-400 text-[9px] font-black text-[var(--main-bg)] uppercase shadow-[var(--neo-shadow-hover)]">
              <TrendingDown size={10} strokeWidth={3} /> {bottomCategory}
            </div>
          </div>
        </div>

        {/* Ponto pulsante um pouco menor */}
        <div className="w-2.5 h-2.5 bg-[var(--secondary)] rounded-full border-2 border-[var(--black)] animate-pulse mt-1 sm:mt-0" />
      </header>

      {/* Container do Gráfico - Altura mínima reduzida drasticamente (min-h-[100px]) */}
      <div className="flex-grow w-full min-h-[100px] sm:min-h-[120px] mt-1 mb-2">
        <ResponsiveContainer width="100%" height="100%" minHeight={0}>
          <BarChart
            data={distribution}
            layout="vertical"
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" hide />

            <Tooltip
              cursor={{ fill: "var(--black)", opacity: 0.05 }}
              contentStyle={{
                backgroundColor: "var(--main-bg)",
                border: "2px solid var(--black)",
                borderRadius: "8px",
                padding: "6px 10px",
                boxShadow: "4px 4px 0px 0px var(--black)",
              }}
              itemStyle={{
                color: "var(--primary)",
                fontSize: "14px",
                fontWeight: "900",
              }}
              labelStyle={{
                color: "var(--black-muted)",
                fontSize: "10px",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "2px",
              }}
              formatter={(value: string | number | undefined) => {
                if (value === undefined) return ["R$ 0,00", ""];
                const val =
                  typeof value === "string" ? parseFloat(value) : value;
                return [
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(val),
                  "Valor",
                ];
              }}
            />

            {/* Espessura da barra reduzida de 18 para 14 */}
            <Bar
              dataKey="amount"
              radius={[0, 4, 4, 0]}
              barSize={14}
              stroke="var(--black)"
              strokeWidth={2}
            >
              {distribution.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legendas mais compactas no rodapé */}
      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-auto pt-3 border-t-2 border-[var(--black)] border-dashed">
        {distribution.map((item, index) => {
          const total = distribution.reduce((a, b) => a + Number(b.amount), 0);
          const percentage =
            total > 0 ? Math.round((Number(item.amount) / total) * 100) : 0;

          return (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full border-2 border-[var(--black)]"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider">
                {item.name}
              </span>
              <span className="text-[9px] font-bold text-[var(--black-muted)] bg-[var(--main-bg)] px-1 py-0.5 rounded border border-[var(--black-light)]">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
