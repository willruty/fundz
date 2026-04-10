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

// Dados mockados para um mês completo (30 dias)
const allData = [
  { day: "01", amount: 120 }, { day: "02", amount: 300 }, { day: "03", amount: 150 },
  { day: "04", amount: 450 }, { day: "05", amount: 200 }, { day: "06", amount: 580 },
  { day: "07", amount: 320 }, { day: "08", amount: 110 }, { day: "09", amount: 250 },
  { day: "10", amount: 280 }, { day: "11", amount: 400 }, { day: "12", amount: 150 },
  { day: "13", amount: 90 },  { day: "14", amount: 350 }, { day: "15", amount: 420 },
  { day: "16", amount: 100 }, { day: "17", amount: 200 }, { day: "18", amount: 500 },
  { day: "19", amount: 300 }, { day: "20", amount: 150 }, { day: "21", amount: 600 },
  { day: "22", amount: 250 }, { day: "23", amount: 180 }, { day: "24", amount: 400 },
  { day: "25", amount: 320 }, { day: "26", amount: 210 }, { day: "27", amount: 550 },
  { day: "28", amount: 150 }, { day: "29", amount: 300 }, { day: "30", amount: 450 },
];

export function DailySpendingChart() {
  const [period, setPeriod] = useState("7d");

  // Filtra os dados de trás para frente baseado no período
  const chartData = 
    period === "7d" ? allData.slice(-7) : 
    period === "15d" ? allData.slice(-15) : 
    allData;

  return (
    <div className="flex flex-col bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_#000000] h-[420px] overflow-hidden">
      
      {/* Cabeçalho Azul Alinhado com o restante do projeto */}
      <div className="bg-[#08233e] border-b-[3px] border-black px-6 py-4 flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-extrabold tracking-widest text-[#FF3B3B] uppercase mb-1">
            Fluxo de Caixa
          </h3>
          <h2 className="text-xl font-black text-white m-0">Gasto Diário</h2>
        </div>

        {/* Filtros Interativos */}
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

      {/* Container do Gráfico */}
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
            
            {/* Linha Brutalista com Pontos Marcados */}
            <Line
              type="linear"
              dataKey="amount"
              stroke="#FF3B3B"
              strokeWidth={4}
              dot={{ r: 4, stroke: '#000', strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 7, stroke: '#000', strokeWidth: 3, fill: '#FF3B3B' }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
}