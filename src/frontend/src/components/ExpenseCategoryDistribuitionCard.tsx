import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Dados mockados
const data = [
  { name: "Supermercado", value: 1200, color: "#FF3B3B" },
  { name: "Restaurantes", value: 850, color: "#08233e" },
  { name: "Transporte", value: 500, color: "#ffd100" },
  { name: "Lazer", value: 600, color: "#000000" },
  { name: "Outros", value: 300, color: "#9ca3af" }, // Cinza
];

export function CategoryDistributionCard() {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const totalSpent = data.reduce((sum, entry) => sum + entry.value, 0);

  // 2. Tipando os handlers do PieChart
  // O Recharts passa o objeto da fatia como primeiro argumento (_) e o index como segundo
  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  const activeData = activeIndex >= 0 ? data[activeIndex] : null;
  const displayValue = activeData ? activeData.value : totalSpent;
  const displayTitle = activeData ? activeData.name : "Total Gasto";

  const displayPercentage = activeData
    ? ((activeData.value / totalSpent) * 100).toFixed(0) + "%"
    : null;

  // 3. Tipando o argumento 'val' como number
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <div className="flex flex-col bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_#000000] h-[420px] p-6 relative">
      {/* Cabeçalho "Clean" e Massivo (sem a tarja azul) */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-3xl font-black text-black uppercase tracking-tighter leading-none">
            Categorias
          </h2>
          <h3 className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase mt-1">
            Onde seu dinheiro foi
          </h3>
        </div>
        <span className="text-[10px] font-black bg-[#ffd100] text-black px-2 py-1 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] uppercase">
          Este Mês
        </span>
      </div>

      {/* Área Principal do Gráfico */}
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={90} // Raio interno aumentado
              outerRadius={125} // Raio externo aumentado (gráfico gigante)
              paddingAngle={1}
              dataKey="value"
              stroke="#000000"
              strokeWidth={3}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              style={{ cursor: "pointer" }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={
                    activeIndex === -1 || activeIndex === index ? 1 : 0.3
                  }
                  className="transition-opacity duration-300 outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Tooltip Dinâmica "Chumbada" no Centro do Gráfico */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">
            {displayTitle}
          </span>
          <span className="text-3xl font-black text-black tracking-tighter leading-none">
            {formatCurrency(displayValue)}
          </span>
          {/* Mostra a tag de % apenas se estiver com o mouse em cima de uma fatia */}
          {displayPercentage && (
            <span className="text-[10px] font-black text-white bg-black px-2 py-0.5 mt-2 border-[2px] border-black rounded uppercase shadow-[2px_2px_0px_0px_#000000]">
              {displayPercentage} DO TOTAL
            </span>
          )}
        </div>
      </div>

      {/* Legenda Horizontal na Base (Dotted Line separando) */}
      <div className="flex flex-wrap justify-center gap-2 mt-2 pt-4 border-t-[3px] border-black border-dotted">
        {data.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000000]"
          >
            {/* Bolinha com a cor da categoria */}
            <div
              className="w-2.5 h-2.5 rounded-full border border-black"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-[9px] font-black text-black uppercase tracking-wider">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
