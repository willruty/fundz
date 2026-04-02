import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { AccountSummary } from "../types/dashboard";

const ACCENTS = ["var(--primary)", "var(--secondary)", "#22c55e", "#a855f7", "#f97316"];

type Props = { accounts: AccountSummary[] };

export function AccountList({ accounts = [] }: Props) {
  if (!accounts.length) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="flex flex-wrap gap-3">
      {accounts.map((acc, i) => {
        const balance = Number(acc.balance);
        const isPositive = balance >= 0;
        const accent = ACCENTS[i % ACCENTS.length];
        const initials = acc.name.slice(0, 2).toUpperCase();

        return (
          <div
            key={acc.name}
            className="group relative flex items-center gap-4 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-default overflow-hidden pr-5"
          >
            {/* Faixa colorida lateral */}
            <div className="w-2 self-stretch shrink-0" style={{ background: accent }} />

            {/* Avatar com inicial */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-[var(--black)] shrink-0 font-black text-sm"
              style={{
                background: accent,
                color: accent === "var(--secondary)" ? "var(--primary)" : "#fff",
              }}
            >
              {initials}
            </div>

            <div className="flex flex-col py-3">
              <span className="text-[9px] font-black uppercase text-[var(--black-muted)] tracking-[0.18em] mb-0.5">
                {acc.name}
              </span>
              <span
                className={`text-lg font-black tracking-tighter leading-none ${
                  isPositive ? "text-[var(--primary)]" : "text-red-500"
                }`}
              >
                {fmt(balance)}
              </span>
            </div>

            {/* Indicador de positivo/negativo */}
            <div
              className={`absolute top-2 right-2 p-0.5 rounded border border-[var(--black)] ${
                isPositive ? "bg-emerald-400" : "bg-red-400"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight size={10} strokeWidth={3} className="text-[var(--primary)]" />
              ) : (
                <ArrowDownRight size={10} strokeWidth={3} className="text-white" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
