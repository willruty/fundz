import { TrendingUp } from "lucide-react";
import type { AccountSummary, TransactionSummary } from "../types/dashboard";

type BalanceCardProps = {
  accounts?: AccountSummary[];
  transactions?: TransactionSummary[];
};

export function BalanceCard({
  accounts = [],
  transactions = [],
}: BalanceCardProps) {
  // 1. Cálculo do Saldo
  const balance =
    accounts?.reduce((acc, account) => {
      return acc + Number(account.balance ?? 0);
    }, 0) ?? 0;

  // 2. Cálculo dinâmico de Receitas e Despesas
  const summary = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.value ?? 0);

      if (transaction.type === "income") {
        acc.income += amount;
      } else if (transaction.type === "expense") {
        acc.expense += amount;
      }

      return acc;
    },
    { income: 0, expense: 0 },
  );

  // 3. Cálculo da Taxa de Poupança
  const savingsRate =
    summary.income > 0
      ? Math.round(((summary.income - summary.expense) / summary.income) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* CARD 1: BALANÇO Total (Mantido igual) */}
      <div className="bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] p-6 w-full shadow-[var(--neo-shadow)] relative overflow-hidden group min-h-[160px] flex flex-col justify-center transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
        <div className="relative z-10">
          <header className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase text-[var(--black)] tracking-[0.2em]">
              Saldo Total
            </span>
          </header>

          <h2 className="text-4xl md:text-5xl font-black text-[var(--primary)] tracking-tighter leading-none">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(balance)}
          </h2>

          <div className="flex items-center gap-2 mt-4 bg-white w-fit px-3 py-1.5 rounded-full border-2 border-[var(--black)]">
            <TrendingUp size={12} className="text-[var(--primary)] font-bold" />
            <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider">
              Saldo em tempo real
            </span>
          </div>
        </div>
      </div>

      {/* CARD 2: RECEITA VS DESPESA (Compactado) */}
      {/* Reduzi o padding geral de p-6 para p-4 */}
      <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-4 w-full h-full shadow-[var(--neo-shadow)] relative flex flex-col justify-between group transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
        {/* Reduzi a margem inferior do header de mb-6 para mb-3 */}
        <header className="relative z-10 flex justify-between items-center mb-3">
          <span className="text-xs font-bold uppercase text-[var(--black-muted)] tracking-wider">
            Receita vs Despesa
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[var(--black)] animate-pulse" />
        </header>

        {/* Reduzi o gap entre Entradas e Saídas de gap-6 para gap-3 */}
        <div className="relative z-10 flex flex-col gap-3">
          {/* Receitas */}
          <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase text-[var(--black-light)] mb-0.5">
              Entradas
            </p>
            <div className="flex justify-between items-center">
              {/* Fonte reduzida de text-2xl para text-xl */}
              <h3 className="text-xl font-black text-emerald-600 leading-none tracking-tighter">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(summary.income)}
              </h3>
              {/* Barra reduzida de h-3/w-24 para h-2/w-20 */}
              <div className="h-2 w-20 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 border-r-2 border-[var(--black)] transition-all duration-1000"
                  style={{
                    width: `${Math.min(
                      100,
                      (summary.income /
                        (summary.income + summary.expense || 1)) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Despesas */}
          <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase text-[var(--black-light)] mb-0.5">
              Saídas
            </p>
            <div className="flex justify-between items-center">
              {/* Fonte reduzida de text-2xl para text-xl */}
              <h3 className="text-xl font-black text-red-500 leading-none tracking-tighter">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(summary.expense)}
              </h3>
              {/* Barra reduzida de h-3/w-24 para h-2/w-20 */}
              <div className="h-2 w-20 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 border-r-2 border-[var(--black)] transition-all duration-1000"
                  style={{
                    width: `${Math.min(
                      100,
                      (summary.expense /
                        (summary.income + summary.expense || 1)) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Margens superiores do rodapé reduzidas de mt-6 pt-4 para mt-4 pt-3 */}
        <footer className="relative z-10 mt-4 pt-3 border-t-2 border-[var(--black)] border-dashed flex justify-between items-center">
          <span className="text-[10px] font-bold text-[var(--black-muted)] uppercase tracking-wider">
            Taxa de Poupança
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-md border-2 border-[var(--black)] font-black ${
              savingsRate >= 0
                ? "bg-emerald-400 text-[var(--primary)]"
                : "bg-red-400 text-[var(--main-bg)]"
            }`}
          >
            {savingsRate}%
          </span>
        </footer>
      </div>
    </div>
  );
}
