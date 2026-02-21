import { useEffect, useState } from "react";
import { TrendingUp, AlertCircle, RefreshCw } from "lucide-react";

interface BalanceCardProps {
  accountId: string;
}

export function BalanceCard({ accountId }: BalanceCardProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchBalance = async () => {
    setLoading(true);
    setError(false);
    try {
      const token = localStorage.getItem("token");
      // Requisição com query_params conforme solicitado
      const response = await fetch(
        `http://localhost:8000/fundz/account/balance/${accountId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      setBalance(Number(data.current_balance));
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) fetchBalance();
  }, [accountId]);

  return (
    <div className="bg-secondary border border-white/5 rounded-[32px] p-8 w-full h-full shadow-2xl relative overflow-hidden group">
      {/* Detalhe de fundo para profundidade */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity" />

      <div className="relative z-10">
        <header className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-black uppercase text-black text-bold tracking-[0.2em]">
            Balanço Atual
          </span>
          <button
            onClick={fetchBalance}
            className="text-primary hover:rotate-180 transition-transform duration-500 cursor-pointer"
          >
            <RefreshCw size={14} />
          </button>
        </header>

        {loading ? (
          <div className="h-10 w-32 bg-white/5 animate-pulse rounded-lg" />
        ) : error ? (
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
            <AlertCircle size={14} />
            Erro ao carregar saldo
          </div>
        ) : (
          <div className="flex flex-col">
            <h2 className="text-4xl font-black text-primary tracking-tighter">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(balance || 0)}
            </h2>

            <div className="flex items-center gap-2 mt-4 bg-off-white/40 w-fit px-3 py-1 rounded-full border border-white/5">
              <TrendingUp size={12} className="text-primary" />
              <span className="text-[10px] font-black text-black/70">
                Aumentou X
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
