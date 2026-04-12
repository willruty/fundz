import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DayAmount {
  day: string;
  amount: number;
}

interface DailySpendingChartProps {
  data: DayAmount[];
}

export function DailySpendingChart({ data }: DailySpendingChartProps) {
  const [period, setPeriod] = useState("7d");

  const chartData =
    period === "7d"  ? data.slice(-7)  :
    period === "15d" ? data.slice(-15) :
    data;

  return (
    <div className="flex flex-col bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_#000000] h-[420px] overflow-hidden">

      <div className="bg-[#08233e] border-b-[3px] border-black px-6 py-4 flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-extrabold tracking-widest text-[#FF3B3B] uppercase mb-1">
            Fluxo de Caixa
          </h3>
          <h2 className="text-xl font-black text-white m-0">Gasto Diário</h2>
        </div>

        <div className="flex gap-2">
          {["7d", "15d", "30d"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-black border-2 border-black rounded transition-colors ${
                period === p
                  ? "bg-[#FF3B3B] text-white shadow-[2px_2px_0px_0px_#000000]"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full p-6 pt-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="day"
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
              tickLine={false}
              tick={{ fill: "#000", fontWeight: 700, fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
              tickLine={false}
              tick={{ fill: "#000", fontWeight: 700, fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "3px solid #000",
                borderRadius: "8px",
                fontWeight: "900",
                boxShadow: "4px 4px 0px 0px #000",
              }}
              formatter={(value) => [`R$ ${value}`, "Gasto"]}
              labelFormatter={(label) => `Dia ${label}`}
            />
            <Line
              type="linear"
              dataKey="amount"
              stroke="#FF3B3B"
              strokeWidth={4}
              dot={{ r: 4, stroke: "#000", strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 7, stroke: "#000", strokeWidth: 3, fill: "#FF3B3B" }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
