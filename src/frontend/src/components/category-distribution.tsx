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

const COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
];

export function CategoryDistributionCard() {
  const data = [
    { name: "Lazer", value: 850 },
    { name: "Contas", value: 1200 },
    { name: "Saúde", value: 300 },
    { name: "Mercado", value: 650 },
    { name: "Transporte", value: 150 },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white border border-white/5 rounded-[32px] p-8 w-full h-[220px] shadow-2xl relative overflow-hidden group flex flex-col justify-between">
      <header className="flex justify-between items-center relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-black-light tracking-[0.2em]">
            Distribuição
          </span>
          <div className="flex gap-4 mt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-600 uppercase italic">
              <TrendingUp size={12} /> {data[0].name}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-black text-red-500 uppercase italic">
              <TrendingDown size={12} /> {data[data.length - 1].name}
            </div>
          </div>
        </div>
        <div className="w-2.5 h-2.5 bg-secondary rounded-full shadow-[0_0_10px_rgba(255,209,0,0.5)] animate-pulse" />
      </header>

      {/* Container do Gráfico - Ajustei o margin para dar mais espaço interno */}
      <div className="flex-1 w-full mt-6 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: -30, right: 20 }}
            barCategoryGap="25%" // Adiciona o espaçamento entre as categorias
          >
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" hide />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.02)" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
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
                  "",
                ];
              }}
            />
            <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={12}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legendas Aumentadas e com mais peso visual */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 border-t border-black/5 pt-5">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2.5">
            <div
              className="w-2 h-2 rounded-full border border-black/5"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-[10px] font-black text-blackzão uppercase tracking-wide">
              {item.name}
            </span>
            <span className="text-[10px] font-bold text-black-light">
              {Math.round(
                (item.value / data.reduce((a, b) => a + b.value, 0)) * 100,
              )}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
