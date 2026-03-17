import { Wallet } from "lucide-react";
import type { AccountSummary } from "../types/dashboard";

type Props = {
  accounts: AccountSummary[];
};

export function AccountList({ accounts = [] }: Props) {
  if (!accounts.length) {
    return (
      <div className="text-[var(--black-muted)] font-bold">
        Nenhuma conta encontrada.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 p-0 m-0">
      {accounts.map((acc) => (
        <div
          key={acc.name}
          className="flex items-center gap-4 bg-[var(--main-bg)] border-2 border-[var(--black)] px-4 py-2 rounded-full shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-default"
        >
          {/* Ícone com Contraste Realçado */}
          <div className="w-10 h-10 rounded-full bg-[var(--secondary)] border-2 border-[var(--black)] flex items-center justify-center">
            <Wallet className="text-[var(--primary)]" size={18} />
          </div>

          {/* Info Vital com Hierarquia Clara */}
          <div className="flex flex-col pr-2">
            <span className="text-[10px] font-bold uppercase text-[var(--black-muted)] tracking-wider mb-0.5">
              {acc.name}
            </span>
            <span className="text-base font-black text-[var(--primary)] leading-tight tracking-tighter">
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
