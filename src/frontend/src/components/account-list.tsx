import { Wallet } from "lucide-react";
import type { AccountSummary } from "../types/dashboard";

type Props = {
  accounts: AccountSummary[];
};

export function AccountList({ accounts = [] }: Props) {
  if (!accounts.length) {
    return (
      <div className="text-gray-400 font-bold">Nenhuma conta encontrada.</div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 p-0 m-0">
      {accounts.map((acc) => (
        <div
          key={acc.name}
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
