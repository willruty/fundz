import { useEffect, useState } from "react";
import { TrendingUp, AlertCircle, RefreshCw } from "lucide-react";

interface Transaction {
  amount: number | string;
  type: "income" | "expense";
  occurred_at: string;
}

interface BalanceCardProps {
  accountId: string;
}

export function BalanceCard({ accountId }: BalanceCardProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Estado para o resumo do card inferior
  const [summary, setSummary] = useState({ income: 0, expense: 0 });

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    const token = localStorage.getItem("token");

    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch do Balanço Atual
      const balanceRes = await fetch(
        `http://localhost:8000/fundz/account/balance/${accountId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const balanceData = await balanceRes.json();
      setBalance(Number(balanceData.current_balance));

      // 2. Fetch das Transações para o Resumo
      const transRes = await fetch(
        "http://localhost:8000/fundz/transaction/last-month",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const rawData = await transRes.json();
      const transactions: Transaction[] = Array.isArray(rawData)
        ? rawData
        : rawData.transactions || [];

      // Cálculo de Receita vs Despesa
      let income = 0;
      let expense = 0;

      transactions.forEach((t) => {
        const value = parseFloat(String(t.amount));
        if (t.type === "income") income += value;
        else expense += value;
      });

      setSummary({ income, expense });
    } catch (err) {
      console.error("Erro no Fundz Analytics Engine:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) fetchData();
  }, [accountId]);

  // Cálculo da taxa de poupança com proteção contra divisão por zero
  const savingsRate =
    summary.income > 0
      ? Math.round(((summary.income - summary.expense) / summary.income) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* CARD 1: BALANÇO ATUAL (AMARELO) */}
      <div className="bg-secondary border border-white/5 rounded-[32px] p-6 w-full shadow-2xl relative overflow-hidden group min-h-[160px] flex flex-col justify-center">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary opacity-5 rounded-full blur-2xl" />

        <div className="relative z-10">
          <header className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase text-black tracking-[0.2em]">
              Balanço Atual
            </span>
            <button
              onClick={fetchData}
              className={`text-primary hover:rotate-180 transition-transform duration-500 p-1 cursor-pointer ${loading ? "animate-spin" : ""}`}
            >
              <RefreshCw size={12} />
            </button>
          </header>

          {error ? (
            <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold">
              <AlertCircle size={12} /> ERRO AO CARREGAR
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black text-primary tracking-tighter leading-none">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(balance || 0)}
              </h2>

              <div className="flex items-center gap-2 mt-3 bg-black/5 w-fit px-2 py-1 rounded-full border border-black/5">
                <TrendingUp size={10} className="text-primary" />
                <span className="text-[9px] font-black text-black/70 uppercase">
                  Saldo em tempo real
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CARD 2: RESUMO MENSAL (OFF-WHITE) */}
      <div className="bg-white border border-white/5 rounded-[32px] p-6 w-full h-full shadow-2xl relative overflow-hidden flex flex-col justify-between group">
        <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-black/5 rounded-full blur-3xl" />

        <header className="relative z-10 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em]">
            Receita vs Despesa
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </header>

        <div className="relative z-10 flex flex-col gap-5">
          {/* Receitas */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-black uppercase text-black/30 mb-1">
                Entradas
              </p>
              <h3 className="text-xl font-black text-emerald-600 leading-none">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(summary.income)}
              </h3>
            </div>
            <div className="h-1 w-20 bg-black/5 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000"
                style={{
                  width: `${Math.min(100, (summary.income / (summary.income + summary.expense || 1)) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Despesas */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-black uppercase text-black/30 mb-1">
                Saídas
              </p>
              <h3 className="text-xl font-black text-red-500 leading-none">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(summary.expense)}
              </h3>
            </div>
            <div className="h-1 w-20 bg-black/5 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-red-500 transition-all duration-1000"
                style={{
                  width: `${Math.min(100, (summary.expense / (summary.income + summary.expense || 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        <footer className="relative z-10 mt-4 pt-4 border-t border-black/5 flex justify-between items-center">
          <span className="text-[9px] font-bold text-black/40 uppercase">
            Taxa de Poupança
          </span>
          <span
            className={`text-[10px] font-black ${savingsRate >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            {savingsRate}%
          </span>
        </footer>
      </div>
    </div>
  );
}
