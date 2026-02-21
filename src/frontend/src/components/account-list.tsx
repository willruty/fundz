import { useEffect, useState } from "react";
import { Wallet, Plus, AlertCircle } from "lucide-react";

interface Account {
  id: string;
  name: string;
  balance: string;
  type: string;
}

export function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8000/fundz/account/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao sincronizar contas.");
        }

        const data = await response.json();

        // Acessando a chave 'results' do seu JSON
        setAccounts(data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-gray-400 font-bold animate-pulse">
        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
        Sincronizando seus ativos...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 p-4 rounded-2xl border border-red-100">
        <AlertCircle size={20} />
        {error}
      </div>
    );

  return (
    <div className="flex flex-wrap gap-3 p-0 m-0">
      {accounts.map((acc) => (
        <div
          key={acc.id}
          className="flex items-center gap-5 bg-primary border border-white/10 px-3 py-3 rounded-full shadow-lg hover:shadow-secondary/5 hover:border-secondary/30 transition-all group cursor-default"
        >
          {/* Ícone com Contraste Realçado */}
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shadow-inner">
            <Wallet className="text-primary" size={16} />
          </div>

          {/* Info Vital com Hierarquia Clara */}
          <div className="flex flex-col pr-2">
            <span className="text-[9px] font-black uppercase text-off-white/50 tracking-[0.15em] mb-0.5">
              {acc.name}
            </span>
            <span className="text-base font-black text-secondary leading-tight tracking-tighter">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(acc.balance))}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
