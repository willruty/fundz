import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface Transaction {
  occurred_at: string;
  amount: string;
  type: "income" | "expense";
}

export function MonthlyBalanceCard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPositive, setIsPositive] = useState(true);
  const [totalDiff, setTotalDiff] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("Token não encontrado");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:8000/fundz/transaction/last-month",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          if (response.status === 401) console.error("Sessão expirada (401)");
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const rawData = await response.json();

        const transactions: Transaction[] = Array.isArray(rawData)
          ? rawData
          : rawData.transactions || [];

        if (transactions.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const groupedData: Record<string, number> = {};

        transactions.forEach((t: Transaction) => {
          const dateObj = new Date(t.occurred_at);
          const date = isNaN(dateObj.getTime())
            ? "Data Inválida"
            : dateObj.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              });

          const amountValue = parseFloat(String(t.amount));
          const val = t.type === "income" ? amountValue : -amountValue;

          groupedData[date] = (groupedData[date] || 0) + val;
        });

        const chartData = Object.keys(groupedData)
          .map((date) => ({
            date,
            valor: Math.round(groupedData[date]),
          }))

          .sort((a, b) => {
            const [dayA, monthA] = a.date.split("/").map(Number);
            const [dayB, monthB] = b.date.split("/").map(Number);
            return monthA !== monthB ? monthA - monthB : dayA - dayB;
          });

        setData(chartData);

        if (chartData.length > 0) {
          const first = chartData[0].valor;
          const last = chartData[chartData.length - 1].valor;
          setIsPositive(last >= first);
          setTotalDiff(last - first);
        }
      } catch (err) {
        console.error("Erro ao carregar gráfico:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const themeColor = isPositive ? "#10b981" : "#ef4444";

  return (
    <div className="bg-primary border border-white/5 rounded-[32px] p-8 w-full h-full shadow-2xl relative overflow-hidden">
      <header className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] block mb-1">
            Performance Mensal
          </span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            Fluxo de Caixa
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] ${isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
            >
              {isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Math.abs(totalDiff))}
            </div>
          </h2>
        </div>
        <div className="flex items-center gap-2 text-white/30 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          <Calendar size={12} />
          <span className="text-[10px] font-black uppercase">30 Dias</span>
        </div>
      </header>

      <div className="h-[250px] w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.03)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "rgba(255,255,255,0.3)",
                fontSize: 10,
                fontWeight: "bold",
              }}
              dy={10}
            />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2 }}
              contentStyle={{
                backgroundColor: "#08233E",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "900",
              }}
              itemStyle={{ color: themeColor }}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke={themeColor}
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <footer className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
        <span>Fundz Analytics Engine</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
            <span>Positivo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />{" "}
            <span>Negativo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
