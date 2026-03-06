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
  "#c9c9c9",
  "#ffd100", 
  "#08233e", 
  "#0c3156", 
  "#000", 
];

type Props = {
  distribution: CategoryDistribution[];
};

export function CategoryDistributionCard({ distribution = [] }: Props) {
  return (
    <div className="bg-white border border-white/5 rounded-[32px] p-8 w-full h-[220px] shadow-2xl relative overflow-hidden group flex flex-col justify-between">
      <header className="flex justify-between items-center relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-black-light tracking-[0.2em]">
            Distribuição
          </span>
          <div className="flex gap-4 mt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-600 uppercase italic">
              <TrendingUp size={12} /> {distribution[0].name}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-black text-red-500 uppercase italic">
              <TrendingDown size={12} />{" "}
              {distribution[distribution.length - 1].name}
            </div>
          </div>
        </div>
        <div className="w-2.5 h-2.5 bg-secondary rounded-full shadow-[0_0_10px_rgba(255,209,0,0.5)] animate-pulse" />
      </header>

      {/* Container do Gráfico - Ajustei o margin para dar mais espaço interno */}
      <div className="flex-1 w-full mt-6 mb-2">
        <ResponsiveContainer width="100%" height="100%" minHeight={0}>
          <BarChart
            data={distribution}
            layout="vertical"
            margin={{ left: 0, right: 20, top: 0, bottom: 0 }} // Comece do zero
            barCategoryGap="25%"
          >
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" hide />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }} // Cursor arredondado também!
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid rgba(0,0,0,0.05)",
                borderRadius: "12px",
                padding: "8px 12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
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
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Bar dataKey="amount" radius={[0, 12, 12, 0]} barSize={12}>
              {distribution.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`} // Agora 'entry' está sendo lida!
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legendas Aumentadas e com mais peso visual */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 border-t border-black/5 pt-5">
        {distribution.map((item, index) => (
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
                (Number(item.amount) /
                  distribution.reduce((a, b) => a + Number(b.amount), 0)) *
                  100,
              )}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
